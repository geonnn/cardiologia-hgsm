import { useState, type FormEvent } from 'react'
import { ArrowLeftRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useApiQuery } from '@/hooks/useApiQuery'
import { mensajeDeError } from '@/lib/api'
import { ahoraInputLocal, inputLocalAIsoUtc, isoAInputLocal } from '@/lib/fechas'
import {
  listarCamasInternacionRequest,
  listarMotivosInternacionRequest,
  listarObrasSocialesRequest,
  type CamaDto,
  type InternacionDetalle,
  type Manejo,
  type ModificarInternacionPayload,
  type MotivoInternacionDto,
  type ObraSocialDto,
} from '../api/internacionesApi'
import { MANEJOS, MAX_LONGITUD_AISLAMIENTO } from '../constants'
import { validarModificarInternacion, type ErroresModificarInternacion } from '../validaciones'
import { MotivosCombobox } from './MotivosCombobox'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50'

interface EditarInternacionDialogProps {
  open: boolean
  internacion: InternacionDetalle
  onOpenChange: (open: boolean) => void
  onGuardar: (payload: ModificarInternacionPayload) => Promise<unknown>
}

/** Modal de edición de internación activa y pase o intercambio (swap) de cama (HU-20 / RF-49). */
export function EditarInternacionDialog({
  open,
  internacion,
  onOpenChange,
  onGuardar,
}: EditarInternacionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Modificar internación
          </DialogTitle>
          <DialogDescription>
            Editá datos clínicos, motivos o reasigná la cama de{' '}
            <strong className="text-foreground">
              {internacion.paciente.apellido}, {internacion.paciente.nombre}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <EditarInternacionForm
          internacion={internacion}
          onSubmit={async (payload) => {
            await onGuardar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditarInternacionForm({
  internacion,
  onSubmit,
}: {
  internacion: InternacionDetalle
  onSubmit: (payload: ModificarInternacionPayload) => Promise<void>
}) {
  const [ahoraStr] = useState(ahoraInputLocal)

  const camasQuery = useApiQuery<CamaDto[]>(listarCamasInternacionRequest())
  const motivosQuery = useApiQuery<MotivoInternacionDto[]>(listarMotivosInternacionRequest())
  const obrasSocialesQuery = useApiQuery<ObraSocialDto[]>(listarObrasSocialesRequest())

  const [camaId, setCamaId] = useState(internacion.cama.id)
  const [fechaInternacion, setFechaInternacion] = useState(() =>
    isoAInputLocal(internacion.fechaInternacion),
  )
  const [manejo, setManejo] = useState<Manejo>(internacion.manejo)
  const [motivoIds, setMotivoIds] = useState<number[]>(
    internacion.motivosInternacion.map((m) => m.id),
  )
  const [obraSocialId, setObraSocialId] = useState<string>(
    internacion.obraSocial ? String(internacion.obraSocial.id) : '',
  )
  const [aislamiento, setAislamiento] = useState(internacion.aislamiento ?? '')
  const [camaAislamientoId, setCamaAislamientoId] = useState('')
  const [enfermedadActual, setEnfermedadActual] = useState(internacion.enfermedadActual)
  const [parametrosAntropometria, setParametrosAntropometria] = useState(
    internacion.parametrosAntropometria ?? '',
  )
  const [tratamientoPrevio, setTratamientoPrevio] = useState(internacion.tratamientoPrevio ?? '')
  const [observaciones, setObservaciones] = useState(internacion.observaciones ?? '')

  const [errores, setErrores] = useState<ErroresModificarInternacion>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const camas = camasQuery.data ?? []
  const camasDisponibles = camas.filter((c) => c.estado === 'Disponible')
  const camasOcupadasOtras = camas.filter(
    (c) => c.estado === 'Ocupada' && c.id !== internacion.cama.id,
  )
  const camasParaAislamiento = camasDisponibles.filter((c) => c.id !== camaId)
  const camaDestinoSwap = camasOcupadasOtras.find((c) => c.id === camaId)

  const catalogosError = camasQuery.error ?? motivosQuery.error ?? obrasSocialesQuery.error

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarModificarInternacion({
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
      await onSubmit({
        camaId,
        fechaInternacion: inputLocalAIsoUtc(fechaInternacion),
        manejo,
        enfermedadActual: enfermedadActual.trim(),
        motivoInternacionIds: motivoIds,
        obraSocialId: obraSocialId ? Number(obraSocialId) : null,
        aislamiento: aislamiento.trim() || null,
        camaAislamientoId: camaAislamientoId || null,
        parametrosAntropometria: parametrosAntropometria.trim() || null,
        tratamientoPrevio: tratamientoPrevio.trim() || null,
        observaciones: observaciones.trim() || null,
      })
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="grid gap-4" aria-busy={enviando}>
      {(errorServidor || catalogosError) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorServidor ?? `No se pudieron cargar los catálogos: ${catalogosError}`}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Columna izquierda: ubicación, motivos y enfermedad actual */}
        <FieldGroup className="gap-3.5 lg:col-span-7">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Ubicación y datos de ingreso
          </p>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field data-invalid={errores.camaId ? true : undefined}>
              <FieldLabel htmlFor="editar-int-cama">
                Cama asignada <span className="text-destructive">*</span>
              </FieldLabel>
              <select
                id="editar-int-cama"
                className={SELECT_CLASS}
                value={camaId}
                onChange={(e) => {
                  const nuevaCamaId = e.target.value
                  setCamaId(nuevaCamaId)
                  if (camaAislamientoId === nuevaCamaId) setCamaAislamientoId('')
                }}
                aria-invalid={errores.camaId ? true : undefined}
              >
                <optgroup label="Cama actual">
                  <option value={internacion.cama.id}>
                    {internacion.cama.sector} #{internacion.cama.numeroCama} (Actual)
                  </option>
                </optgroup>

                {camasDisponibles.length > 0 && (
                  <optgroup label="Camas disponibles (pase)">
                    {camasDisponibles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.sector} #{c.numeroCama} — Disponible
                      </option>
                    ))}
                  </optgroup>
                )}

                {camasOcupadasOtras.length > 0 && (
                  <optgroup label="Camas ocupadas (intercambio / swap)">
                    {camasOcupadasOtras.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.sector} #{c.numeroCama} —{' '}
                        {c.ocupante
                          ? `Ocupada por ${c.ocupante.apellido}, ${c.ocupante.nombre}`
                          : 'Ocupada'}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {errores.camaId && <FieldError>{errores.camaId}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="editar-int-manejo">
                Tipo de tratamiento <span className="text-destructive">*</span>
              </FieldLabel>
              <select
                id="editar-int-manejo"
                className={SELECT_CLASS}
                value={manejo}
                onChange={(e) => setManejo(e.target.value as Manejo)}
              >
                {MANEJOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {camaDestinoSwap && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950">
              <ArrowLeftRightIcon className="mt-0.5 size-4 shrink-0 text-amber-700" />
              <span>
                <strong>Intercambio automático (swap):</strong> al guardar,{' '}
                <strong>
                  {internacion.paciente.apellido}, {internacion.paciente.nombre}
                </strong>{' '}
                pasará a{' '}
                <strong>
                  {camaDestinoSwap.sector} #{camaDestinoSwap.numeroCama}
                </strong>{' '}
                y{' '}
                <strong>
                  {camaDestinoSwap.ocupante
                    ? `${camaDestinoSwap.ocupante.apellido}, ${camaDestinoSwap.ocupante.nombre}`
                    : 'el paciente ocupante'}
                </strong>{' '}
                pasará a{' '}
                <strong>
                  {internacion.cama.sector} #{internacion.cama.numeroCama}
                </strong>
                .
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field data-invalid={errores.fechaInternacion ? true : undefined}>
              <FieldLabel htmlFor="editar-int-fecha">
                Fecha y hora de ingreso <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="editar-int-fecha"
                type="datetime-local"
                max={ahoraStr}
                className="h-10"
                value={fechaInternacion}
                onChange={(e) => setFechaInternacion(e.target.value)}
                aria-invalid={errores.fechaInternacion ? true : undefined}
              />
              {errores.fechaInternacion && <FieldError>{errores.fechaInternacion}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="editar-int-obra-social">Obra social (opcional)</FieldLabel>
              <select
                id="editar-int-obra-social"
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
          </div>

          <Separator />
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Motivo y cuadro clínico
          </p>

          <MotivosCombobox
            options={motivosQuery.data ?? []}
            selectedIds={motivoIds}
            error={errores.motivoInternacionIds}
            onChange={setMotivoIds}
          />

          <Field data-invalid={errores.enfermedadActual ? true : undefined}>
            <FieldLabel htmlFor="editar-int-enfermedad">
              Enfermedad actual <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="editar-int-enfermedad"
              rows={3}
              value={enfermedadActual}
              onChange={(e) => setEnfermedadActual(e.target.value)}
              aria-invalid={errores.enfermedadActual ? true : undefined}
            />
            {errores.enfermedadActual && <FieldError>{errores.enfermedadActual}</FieldError>}
          </Field>
        </FieldGroup>

        {/* Columna derecha: aislamiento y datos clínicos complementarios */}
        <FieldGroup className="gap-3.5 border-t pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Aislamiento y datos complementarios
          </p>

          <Field data-invalid={errores.aislamiento ? true : undefined}>
            <FieldLabel htmlFor="editar-int-aislamiento">Aislamiento (opcional)</FieldLabel>
            <Input
              id="editar-int-aislamiento"
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
            <FieldLabel htmlFor="editar-int-cama-aisl">
              Bloquear cama por aislamiento (opcional)
            </FieldLabel>
            <select
              id="editar-int-cama-aisl"
              className={SELECT_CLASS}
              value={camaAislamientoId}
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
            {errores.camaAislamientoId && <FieldError>{errores.camaAislamientoId}</FieldError>}
          </Field>

          <Separator />

          <Field>
            <FieldLabel htmlFor="editar-int-parametros">Parámetros / Antropometría</FieldLabel>
            <Textarea
              id="editar-int-parametros"
              rows={2}
              value={parametrosAntropometria}
              onChange={(e) => setParametrosAntropometria(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="editar-int-trat-previo">Tratamiento previo</FieldLabel>
            <Textarea
              id="editar-int-trat-previo"
              rows={2}
              value={tratamientoPrevio}
              onChange={(e) => setTratamientoPrevio(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="editar-int-obs">Observaciones</FieldLabel>
            <Textarea
              id="editar-int-obs"
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Field>
        </FieldGroup>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="brand" size="lg" className="h-10 px-4" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  )
}
