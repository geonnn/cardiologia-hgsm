import { useState, type FormEvent } from 'react'
import { AlertTriangleIcon, ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useApiQuery } from '@/hooks/useApiQuery'
import { mensajeDeError } from '@/lib/api'
import { ahoraInputLocal, inputLocalAIsoUtc } from '@/lib/fechas'
import {
  crearInternacion,
  listarCamasInternacionRequest,
  listarMotivosInternacionRequest,
  listarObrasSocialesRequest,
  obtenerInternacionActivaRequest,
  obtenerPacientePorIdRequest,
  type CamaDto,
  type InternacionDetalle,
  type Manejo,
  type MotivoInternacionDto,
  type ObraSocialDto,
  type PacienteDetalleDto,
} from '../api/internacionesApi'
import { MotivosCombobox } from '../components/MotivosCombobox'
import { PacienteBuscador, type PacienteSeleccionado } from '../components/PacienteBuscador'
import { MANEJOS, MAX_LONGITUD_AISLAMIENTO } from '../constants'
import { validarNuevaInternacion, type ErroresNuevaInternacion } from '../validaciones'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50'

/** Formulario de alta de internación de un paciente (HU-19 / RF-47). */
export function NuevaInternacionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const camaIdInicial = searchParams.get('camaId') ?? ''
  const pacienteIdInicial = searchParams.get('pacienteId') ?? ''
  const desde = searchParams.get('desde') ?? ''

  const [ahoraStr] = useState(ahoraInputLocal)

  // Catálogos y precargas
  const camasQuery = useApiQuery<CamaDto[]>(listarCamasInternacionRequest('Disponible'))
  const motivosQuery = useApiQuery<MotivoInternacionDto[]>(listarMotivosInternacionRequest())
  const obrasSocialesQuery = useApiQuery<ObraSocialDto[]>(listarObrasSocialesRequest())
  const pacientePrefijadoQuery = useApiQuery<PacienteDetalleDto>(
    obtenerPacientePorIdRequest(pacienteIdInicial),
    { enabled: Boolean(pacienteIdInicial) },
  )

  // Estado del formulario
  const [pacienteElegido, setPacienteElegido] = useState<PacienteSeleccionado | null>(null)
  const [camaId, setCamaId] = useState(camaIdInicial)
  const [manejoManual, setManejoManual] = useState<Manejo | null>(null)
  const [fechaInternacion, setFechaInternacion] = useState(ahoraStr)
  const [motivoIds, setMotivoIds] = useState<number[]>([])
  const [enfermedadActual, setEnfermedadActual] = useState('')
  const [obraSocialId, setObraSocialId] = useState('')
  const [aislamiento, setAislamiento] = useState('')
  const [camaAislamientoId, setCamaAislamientoId] = useState('')
  const [parametrosAntropometria, setParametrosAntropometria] = useState('')
  const [tratamientoPrevio, setTratamientoPrevio] = useState('')
  const [tratamientoActual, setTratamientoActual] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const [errores, setErrores] = useState<ErroresNuevaInternacion>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const pacienteEfectivo: PacienteSeleccionado | null =
    pacienteElegido ??
    (pacientePrefijadoQuery.data
      ? {
          id: pacientePrefijadoQuery.data.id,
          nombre: pacientePrefijadoQuery.data.nombre,
          apellido: pacientePrefijadoQuery.data.apellido,
          dni: pacientePrefijadoQuery.data.dni,
          edad: pacientePrefijadoQuery.data.edad,
          sexo: pacientePrefijadoQuery.data.sexo,
        }
      : null)

  // Verificar proactivamente si el paciente ya posee internación activa (404 = no tiene)
  const internacionActivaQuery = useApiQuery<InternacionDetalle>(
    obtenerInternacionActivaRequest(pacienteEfectivo?.id ?? ''),
    { enabled: Boolean(pacienteEfectivo?.id) },
  )
  const internacionActivaExistente =
    internacionActivaQuery.errorStatus === 404 ? null : (internacionActivaQuery.data ?? null)

  const camasDisponibles = camasQuery.data ?? []
  const camasUco = camasDisponibles.filter((c) => c.sector === 'UCO')
  const camasSala = camasDisponibles.filter((c) => c.sector === 'Sala')
  const camaSeleccionada = camasDisponibles.find((c) => c.id === camaId)
  const camasParaAislamiento = camasDisponibles.filter((c) => c.id !== camaId)

  // RF-47: por defecto toma el sector de la cama elegida hasta que el usuario lo cambie explícitamente
  const manejoEfectivo: Manejo = manejoManual ?? camaSeleccionada?.sector ?? 'UCO'

  const catalogosError =
    camasQuery.error ??
    motivosQuery.error ??
    obrasSocialesQuery.error ??
    (pacienteIdInicial ? pacientePrefijadoQuery.error : null)

  const volver = () => {
    if (desde === 'pacientes') {
      navigate('/pacientes')
    } else if (pacienteIdInicial) {
      navigate(`/pacientes/${pacienteIdInicial}`)
    } else {
      navigate('/camas')
    }
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando || internacionActivaExistente) return
    setErrorServidor(null)

    const pacienteId = pacienteEfectivo?.id ?? ''
    const validacion = validarNuevaInternacion({
      pacienteId,
      camaId,
      fechaInternacion,
      motivoInternacionIds: motivoIds,
      enfermedadActual,
      aislamiento,
      camaAislamientoId,
    })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      const nuevaId = await crearInternacion({
        pacienteId,
        camaId,
        manejo: manejoEfectivo,
        fechaInternacion: fechaInternacion ? inputLocalAIsoUtc(fechaInternacion) : null,
        motivoInternacionIds: motivoIds,
        enfermedadActual: enfermedadActual.trim(),
        obraSocialId: obraSocialId ? Number(obraSocialId) : null,
        aislamiento: aislamiento.trim() || null,
        camaAislamientoId: camaAislamientoId || null,
        parametrosAntropometria: parametrosAntropometria.trim() || null,
        tratamientoPrevio: tratamientoPrevio.trim() || null,
        tratamientoActual: tratamientoActual.trim() || null,
        observaciones: observaciones.trim() || null,
      })

      toast.success('Internación registrada correctamente')
      navigate(`/internaciones/${nuevaId}`, { replace: true })
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={volver}>
            <ArrowLeftIcon className="size-4" />
            <span>
              {desde === 'pacientes'
                ? 'Volver a pacientes'
                : pacienteIdInicial
                  ? 'Volver a la ficha del paciente'
                  : 'Volver a camas'}
            </span>
          </Button>
          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-primary">
            Nueva internación
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Los campos marcados con <span className="text-destructive">*</span> son obligatorios.
        </p>
      </div>

      {(errorServidor || catalogosError) && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{errorServidor ?? `No se pudieron cargar los datos: ${catalogosError}`}</span>
        </div>
      )}

      {internacionActivaExistente && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <div className="flex items-start gap-2.5">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <span>
              Este paciente ya tiene una <strong>internación activa</strong> en{' '}
              <strong>
                {internacionActivaExistente.cama.sector} #
                {internacionActivaExistente.cama.numeroCama}
              </strong>
              . No es posible abrir una segunda internación simultánea.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/internaciones/${internacionActivaExistente.id}`)}
          >
            <ExternalLinkIcon className="size-3.5" />
            <span>Ver internación actual</span>
          </Button>
        </div>
      )}

      <Card className="gap-0 py-0">
        <form noValidate onSubmit={enviar} aria-busy={enviando}>
          <CardContent className="p-5 lg:p-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              {/* Columna izquierda: datos obligatorios y cuadro de ingreso */}
              <div className="flex flex-col gap-5 xl:col-span-7">
                {/* 1. Paciente y ubicación */}
                <FieldGroup className="gap-3.5">
                  <h2 className="text-xs font-bold tracking-wide text-primary uppercase">
                    1. Paciente y ubicación
                  </h2>

                  <PacienteBuscador
                    seleccionado={pacienteEfectivo}
                    bloqueado={Boolean(pacienteIdInicial && pacientePrefijadoQuery.data)}
                    error={errores.pacienteId}
                    onSeleccionar={setPacienteElegido}
                  />

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <Field data-invalid={errores.camaId ? true : undefined}>
                      <FieldLabel htmlFor="nueva-int-cama">
                        Cama disponible <span className="text-destructive">*</span>
                      </FieldLabel>
                      <select
                        id="nueva-int-cama"
                        className={SELECT_CLASS}
                        value={camaId}
                        disabled={camasQuery.cargando || camasDisponibles.length === 0}
                        onChange={(e) => {
                          const nuevaCama = e.target.value
                          setCamaId(nuevaCama)
                          if (camaAislamientoId === nuevaCama) setCamaAislamientoId('')
                        }}
                        aria-invalid={errores.camaId ? true : undefined}
                      >
                        <option value="">
                          {camasQuery.cargando
                            ? 'Cargando camas…'
                            : camasDisponibles.length === 0
                              ? 'No hay camas disponibles'
                              : 'Seleccionar cama…'}
                        </option>
                        {camasUco.length > 0 && (
                          <optgroup label="UCO">
                            {camasUco.map((c) => (
                              <option key={c.id} value={c.id}>
                                UCO #{c.numeroCama}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {camasSala.length > 0 && (
                          <optgroup label="Sala">
                            {camasSala.map((c) => (
                              <option key={c.id} value={c.id}>
                                Sala #{c.numeroCama}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      {errores.camaId && <FieldError>{errores.camaId}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="nueva-int-manejo">
                        Tipo de tratamiento <span className="text-destructive">*</span>
                      </FieldLabel>
                      <select
                        id="nueva-int-manejo"
                        className={SELECT_CLASS}
                        value={manejoEfectivo}
                        onChange={(e) => setManejoManual(e.target.value as Manejo)}
                      >
                        {MANEJOS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field data-invalid={errores.fechaInternacion ? true : undefined}>
                      <FieldLabel htmlFor="nueva-int-fecha">Fecha y hora de ingreso</FieldLabel>
                      <Input
                        id="nueva-int-fecha"
                        type="datetime-local"
                        max={ahoraStr}
                        className="h-10"
                        value={fechaInternacion}
                        onChange={(e) => setFechaInternacion(e.target.value)}
                        aria-invalid={errores.fechaInternacion ? true : undefined}
                      />
                      {errores.fechaInternacion && (
                        <FieldError>{errores.fechaInternacion}</FieldError>
                      )}
                    </Field>
                  </div>
                </FieldGroup>

                <Separator />

                {/* 2. Motivo y cuadro clínico */}
                <FieldGroup className="gap-3.5">
                  <h2 className="text-xs font-bold tracking-wide text-primary uppercase">
                    2. Motivo y cuadro clínico
                  </h2>

                  <MotivosCombobox
                    options={motivosQuery.data ?? []}
                    selectedIds={motivoIds}
                    error={errores.motivoInternacionIds}
                    onChange={setMotivoIds}
                  />

                  <Field data-invalid={errores.enfermedadActual ? true : undefined}>
                    <FieldLabel htmlFor="nueva-int-enfermedad">
                      Enfermedad actual <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      id="nueva-int-enfermedad"
                      rows={3}
                      placeholder="Descripción del cuadro clínico actual que motiva el ingreso…"
                      value={enfermedadActual}
                      onChange={(e) => setEnfermedadActual(e.target.value)}
                      aria-invalid={errores.enfermedadActual ? true : undefined}
                    />
                    {errores.enfermedadActual && (
                      <FieldError>{errores.enfermedadActual}</FieldError>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <Field>
                      <FieldLabel htmlFor="nueva-int-obra-social">Obra social (opcional)</FieldLabel>
                      <select
                        id="nueva-int-obra-social"
                        className={SELECT_CLASS}
                        value={obraSocialId}
                        onChange={(e) => setObraSocialId(e.target.value)}
                      >
                        <option value="">Sin obra social</option>
                        {(obrasSocialesQuery.data ?? []).map((os) => (
                          <option key={os.id} value={os.id}>
                            {os.nombre}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field data-invalid={errores.aislamiento ? true : undefined}>
                      <FieldLabel htmlFor="nueva-int-aislamiento">Aislamiento (opcional)</FieldLabel>
                      <Input
                        id="nueva-int-aislamiento"
                        maxLength={MAX_LONGITUD_AISLAMIENTO}
                        placeholder="Ej. Contacto, Respiratorio"
                        className="h-10"
                        value={aislamiento}
                        onChange={(e) => setAislamiento(e.target.value)}
                        aria-invalid={errores.aislamiento ? true : undefined}
                      />
                      {errores.aislamiento && <FieldError>{errores.aislamiento}</FieldError>}
                    </Field>

                    <Field data-invalid={errores.camaAislamientoId ? true : undefined}>
                      <FieldLabel htmlFor="nueva-int-cama-aisl">
                        Bloquear cama por aislamiento
                      </FieldLabel>
                      <select
                        id="nueva-int-cama-aisl"
                        className={SELECT_CLASS}
                        value={camaAislamientoId}
                        disabled={camasParaAislamiento.length === 0}
                        onChange={(e) => setCamaAislamientoId(e.target.value)}
                        aria-invalid={errores.camaAislamientoId ? true : undefined}
                      >
                        <option value="">Ninguna</option>
                        {camasParaAislamiento.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.sector} #{c.numeroCama}
                          </option>
                        ))}
                      </select>
                      {errores.camaAislamientoId && (
                        <FieldError>{errores.camaAislamientoId}</FieldError>
                      )}
                    </Field>
                  </div>
                </FieldGroup>
              </div>

              {/* Columna derecha: datos clínicos opcionales */}
              <div className="flex flex-col gap-3.5 border-t pt-5 xl:col-span-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6">
                <FieldGroup className="gap-3.5">
                  <h2 className="text-xs font-bold tracking-wide text-primary uppercase">
                    3. Antropometría, tratamientos y observaciones (opcional)
                  </h2>

                  <Field>
                    <FieldLabel htmlFor="nueva-int-parametros">
                      Parámetros / Antropometría
                    </FieldLabel>
                    <Textarea
                      id="nueva-int-parametros"
                      rows={2}
                      placeholder="Peso, talla, superficie corporal, balance hídrico inicial…"
                      value={parametrosAntropometria}
                      onChange={(e) => setParametrosAntropometria(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nueva-int-trat-previo">Tratamiento previo</FieldLabel>
                    <Textarea
                      id="nueva-int-trat-previo"
                      rows={2}
                      placeholder="Medicación habitual previa al ingreso…"
                      value={tratamientoPrevio}
                      onChange={(e) => setTratamientoPrevio(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nueva-int-trat-actual">
                      Tratamiento actual (primera indicación)
                    </FieldLabel>
                    <Textarea
                      id="nueva-int-trat-actual"
                      rows={3}
                      placeholder="Si se completa, se registra automáticamente como primer tratamiento de la internación…"
                      value={tratamientoActual}
                      onChange={(e) => setTratamientoActual(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nueva-int-obs">Observaciones</FieldLabel>
                    <Textarea
                      id="nueva-int-obs"
                      rows={2}
                      placeholder="Aclaraciones relevantes para la guardia o el equipo médico…"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t bg-muted/30 px-6 py-3.5">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-5"
              onClick={volver}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="h-10 px-5 font-semibold"
              disabled={enviando || Boolean(internacionActivaExistente) || camasDisponibles.length === 0}
            >
              {enviando ? 'Registrando internación…' : 'Registrar internación'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
