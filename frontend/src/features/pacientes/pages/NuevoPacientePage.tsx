import { useRef, useState, type FormEvent } from 'react'
import { AlertTriangleIcon, ArrowLeftIcon, BedDoubleIcon, PlusIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PageTitle } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useApiQuery } from '@/hooks/useApiQuery'
import { mensajeDeError } from '@/lib/api'
import { hoyIso } from '@/lib/fechas'
import {
  listarFactoresDeRiesgoRequest,
  listarMedicosDeCabeceraRequest,
  obtenerOCrearMedicoDeCabecera,
  type FactorDeRiesgo,
  type MedicoDeCabecera,
} from '../api/catalogosApi'
import { crearPaciente, type ContactoInput, type Sexo } from '../api/pacientesApi'
import { FactoresRiesgoCombobox } from '../components/FactoresRiesgoCombobox'
import {
  MAX_CONTACTOS,
  MAX_LONGITUD_APELLIDO,
  MAX_LONGITUD_DNI,
  MAX_LONGITUD_MEDICO,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_PARENTESCO,
  MAX_LONGITUD_TELEFONO,
  MIN_LONGITUD_DNI,
  validarContacto,
  validarDatosPaciente,
  type ErroresContacto,
  type ErroresPaciente,
} from '../validaciones'

interface ContactoBorrador extends ContactoInput {
  key: number
}

/** Formulario de alta atómica de paciente con perfil clínico y contactos (RF-24). */
export function NuevoPacientePage() {
  const navigate = useNavigate()
  const [hoyStr] = useState(hoyIso)
  const nextContactoKeyRef = useRef(1)

  const factoresQuery = useApiQuery<FactorDeRiesgo[]>(listarFactoresDeRiesgoRequest())
  const medicosQuery = useApiQuery<MedicoDeCabecera[]>(listarMedicosDeCabeceraRequest())

  // Datos personales (obligatorios)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [sexo, setSexo] = useState<Sexo>('Masculino')
  const [fechaNacimiento, setFechaNacimiento] = useState('')

  // Datos clínicos y contactos (opcionales)
  const [medicoDeCabecera, setMedicoDeCabecera] = useState('')
  const [antecedentes, setAntecedentes] = useState('')
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<number[]>([])
  const [contactos, setContactos] = useState<ContactoBorrador[]>([])

  // Control y validación
  const [erroresPaciente, setErroresPaciente] = useState<ErroresPaciente>({})
  const [erroresContactos, setErroresContactos] = useState<Record<number, ErroresContacto>>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [destinoEnvio, setDestinoEnvio] = useState<'listado' | 'internar'>('listado')

  const catalogosError = factoresQuery.error ?? medicosQuery.error

  const agregarContacto = () => {
    if (contactos.length >= MAX_CONTACTOS) return
    const key = nextContactoKeyRef.current++
    setContactos((prev) => [
      ...prev,
      { key, nombre: '', telefono: '', apellido: '', parentesco: '' },
    ])
  }

  const quitarContacto = (key: number) => {
    setContactos((prev) => prev.filter((c) => c.key !== key))
    setErroresContactos((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const actualizarContacto = (key: number, campo: keyof ContactoInput, valor: string) => {
    setContactos((prev) => prev.map((c) => (c.key === key ? { ...c, [campo]: valor } : c)))
  }

  const guardar = async (destino: 'listado' | 'internar') => {
    if (enviando) return
    setErrorServidor(null)

    const validacionPaciente = validarDatosPaciente({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      medicoDeCabecera,
    })

    const validacionContactos: Record<number, ErroresContacto> = {}
    for (const contacto of contactos) {
      const err = validarContacto(contacto)
      if (Object.keys(err).length > 0) {
        validacionContactos[contacto.key] = err
      }
    }

    setErroresPaciente(validacionPaciente)
    setErroresContactos(validacionContactos)

    if (
      Object.keys(validacionPaciente).length > 0 ||
      Object.keys(validacionContactos).length > 0
    ) {
      return
    }

    setDestinoEnvio(destino)
    setEnviando(true)
    try {
      const medicoId = medicoDeCabecera.trim()
        ? await obtenerOCrearMedicoDeCabecera(medicoDeCabecera.trim())
        : null

      const nuevoId = await crearPaciente({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        sexo,
        fechaNacimiento,
        antecedentes: antecedentes.trim() || null,
        medicoDeCabeceraId: medicoId,
        factorDeRiesgoIds: factoresSeleccionados,
        contactos: contactos.map((c) => ({
          nombre: c.nombre.trim(),
          telefono: c.telefono.trim(),
          apellido: c.apellido?.trim() || null,
          parentesco: c.parentesco?.trim() || null,
        })),
      })

      toast.success('Paciente registrado correctamente')
      if (destino === 'internar') {
        navigate(`/internaciones/nueva?pacienteId=${nuevoId}&desde=pacientes`)
      } else {
        navigate('/pacientes')
      }
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void guardar('listado')
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/pacientes')}
        >
          <ArrowLeftIcon className="size-4" />
          <span>Volver a pacientes</span>
        </Button>
      </div>

      {(errorServidor || catalogosError) && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            {errorServidor ?? `No se pudieron cargar los catálogos: ${catalogosError}`}
          </span>
        </div>
      )}

      <Card className="gap-0 py-0">
        <form noValidate onSubmit={enviar} aria-busy={enviando}>
          <CardHeader className="border-b px-6 pt-6 pb-4">
            <PageTitle>Registrar nuevo paciente</PageTitle>
            <p className="text-xs text-muted-foreground">
              Los campos marcados con <span className="text-destructive">*</span> son obligatorios.
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-7 px-6 py-6">
            {/* 1. Datos personales */}
            <FieldGroup className="gap-4">
              <h2 className="text-sm font-bold tracking-wide text-primary uppercase">
                1. Datos personales y filiatorios
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={erroresPaciente.nombre ? true : undefined}>
                  <FieldLabel htmlFor="nuevo-nombre">
                    Nombre <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="nuevo-nombre"
                    maxLength={MAX_LONGITUD_NOMBRE}
                    placeholder=""
                    className="h-10"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    aria-invalid={erroresPaciente.nombre ? true : undefined}
                  />
                  {erroresPaciente.nombre && <FieldError>{erroresPaciente.nombre}</FieldError>}
                </Field>

                <Field data-invalid={erroresPaciente.apellido ? true : undefined}>
                  <FieldLabel htmlFor="nuevo-apellido">
                    Apellido <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="nuevo-apellido"
                    maxLength={MAX_LONGITUD_APELLIDO}
                    placeholder=""
                    className="h-10"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    aria-invalid={erroresPaciente.apellido ? true : undefined}
                  />
                  {erroresPaciente.apellido && (
                    <FieldError>{erroresPaciente.apellido}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field data-invalid={erroresPaciente.dni ? true : undefined}>
                  <FieldLabel htmlFor="nuevo-dni">
                    DNI <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="nuevo-dni"
                    minLength={MIN_LONGITUD_DNI}
                    maxLength={MAX_LONGITUD_DNI}
                    placeholder=""
                    className="h-10"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    aria-invalid={erroresPaciente.dni ? true : undefined}
                  />
                  {erroresPaciente.dni && <FieldError>{erroresPaciente.dni}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="nuevo-sexo">
                    Sexo <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
                    <SelectTrigger id="nuevo-sexo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field data-invalid={erroresPaciente.fechaNacimiento ? true : undefined}>
                  <FieldLabel htmlFor="nuevo-nacimiento">
                    Fecha de nacimiento <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="nuevo-nacimiento"
                    type="date"
                    max={hoyStr}
                    className="h-10"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    aria-invalid={erroresPaciente.fechaNacimiento ? true : undefined}
                  />
                  {erroresPaciente.fechaNacimiento && (
                    <FieldError>{erroresPaciente.fechaNacimiento}</FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>

            <Separator />

            {/* 2. Perfil clínico */}
            <FieldGroup className="gap-4">
              <h2 className="text-sm font-bold tracking-wide text-primary uppercase">
                2. Perfil clínico inicial (opcional)
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={erroresPaciente.medicoDeCabecera ? true : undefined}>
                  <FieldLabel htmlFor="nuevo-medico">Médico de cabecera</FieldLabel>
                  <Input
                    id="nuevo-medico"
                    list="medicos-cabecera-nuevo"
                    maxLength={MAX_LONGITUD_MEDICO}
                    placeholder="Nombre completo"
                    className="h-10"
                    value={medicoDeCabecera}
                    onChange={(e) => setMedicoDeCabecera(e.target.value)}
                    aria-invalid={erroresPaciente.medicoDeCabecera ? true : undefined}
                  />
                  <datalist id="medicos-cabecera-nuevo">
                    {(medicosQuery.data ?? []).map((m) => (
                      <option key={m.id} value={m.nombre} />
                    ))}
                  </datalist>
                  {erroresPaciente.medicoDeCabecera && (
                    <FieldError>{erroresPaciente.medicoDeCabecera}</FieldError>
                  )}
                </Field>

                <FactoresRiesgoCombobox
                  label="Factores de riesgo cardiovascular"
                  placeholder="Buscar factor de riesgo…"
                  options={factoresQuery.data ?? []}
                  selectedIds={factoresSeleccionados}
                  onChange={setFactoresSeleccionados}
                />
              </div>

              <Field>
                <FieldLabel htmlFor="nuevo-antecedentes">Antecedentes</FieldLabel>
                <Textarea
                  id="nuevo-antecedentes"
                  rows={3}
                  placeholder="Cirugías cardíacas previas, factores hereditarios, patologías crónicas, alergias…"
                  value={antecedentes}
                  onChange={(e) => setAntecedentes(e.target.value)}
                />
              </Field>
            </FieldGroup>

            <Separator />

            {/* 3. Contactos familiares */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold tracking-wide text-primary uppercase">
                  3. Contactos del paciente
                </h2>
                <Badge variant="secondary">
                  {contactos.length} de {MAX_CONTACTOS} contactos
                </Badge>
              </div>

              {contactos.length > 0 && (
                <div className="flex flex-col gap-4">
                  {contactos.map((c, idx) => {
                    const err = erroresContactos[c.key] ?? {}
                    return (
                      <div
                        key={c.key}
                        className="flex flex-col gap-4 rounded-lg border bg-muted/25 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold tracking-wide text-primary uppercase">
                            Contacto #{idx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => quitarContacto(c.key)}
                          >
                            <XIcon className="size-3.5" />
                            <span>Quitar</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field data-invalid={err.nombre ? true : undefined}>
                            <FieldLabel htmlFor={`contacto-${c.key}-nombre`}>
                              Nombre <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              id={`contacto-${c.key}-nombre`}
                              maxLength={MAX_LONGITUD_NOMBRE}
                              placeholder="Nombre del contacto"
                              className="h-10 bg-card"
                              value={c.nombre}
                              onChange={(e) => actualizarContacto(c.key, 'nombre', e.target.value)}
                              aria-invalid={err.nombre ? true : undefined}
                            />
                            {err.nombre && <FieldError>{err.nombre}</FieldError>}
                          </Field>

                          <Field data-invalid={err.telefono ? true : undefined}>
                            <FieldLabel htmlFor={`contacto-${c.key}-telefono`}>
                              Teléfono <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                              id={`contacto-${c.key}-telefono`}
                              maxLength={MAX_LONGITUD_TELEFONO}
                              placeholder="Sólo números"
                              className="h-10 bg-card"
                              value={c.telefono}
                              onChange={(e) =>
                                actualizarContacto(c.key, 'telefono', e.target.value)
                              }
                              aria-invalid={err.telefono ? true : undefined}
                            />
                            {err.telefono && <FieldError>{err.telefono}</FieldError>}
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field data-invalid={err.apellido ? true : undefined}>
                            <FieldLabel htmlFor={`contacto-${c.key}-apellido`}>
                              Apellido (opcional)
                            </FieldLabel>
                            <Input
                              id={`contacto-${c.key}-apellido`}
                              maxLength={MAX_LONGITUD_APELLIDO}
                              placeholder="Apellido del contacto"
                              className="h-10 bg-card"
                              value={c.apellido ?? ''}
                              onChange={(e) =>
                                actualizarContacto(c.key, 'apellido', e.target.value)
                              }
                              aria-invalid={err.apellido ? true : undefined}
                            />
                            {err.apellido && <FieldError>{err.apellido}</FieldError>}
                          </Field>

                          <Field data-invalid={err.parentesco ? true : undefined}>
                            <FieldLabel htmlFor={`contacto-${c.key}-parentesco`}>
                              Parentesco (opcional)
                            </FieldLabel>
                            <Input
                              id={`contacto-${c.key}-parentesco`}
                              maxLength={MAX_LONGITUD_PARENTESCO}
                              placeholder="Ej. Esposa, Hijo"
                              className="h-10 bg-card"
                              value={c.parentesco ?? ''}
                              onChange={(e) =>
                                actualizarContacto(c.key, 'parentesco', e.target.value)
                              }
                              aria-invalid={err.parentesco ? true : undefined}
                            />
                            {err.parentesco && <FieldError>{err.parentesco}</FieldError>}
                          </Field>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {contactos.length < MAX_CONTACTOS && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-10 w-fit border-dashed"
                  onClick={agregarContacto}
                >
                  <PlusIcon className="size-4" />
                  <span>Agregar contacto familiar</span>
                </Button>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap justify-end gap-3 border-t bg-muted/30 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-5"
              onClick={() => navigate('/pacientes')}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="h-10 px-5 font-semibold"
              onClick={() => void guardar('internar')}
              disabled={enviando}
            >
              <BedDoubleIcon className="size-4" />
              <span>
                {enviando && destinoEnvio === 'internar'
                  ? 'Guardando paciente…'
                  : 'Registrar e internar'}
              </span>
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="h-10 px-5 font-semibold"
              disabled={enviando}
            >
              {enviando && destinoEnvio === 'listado'
                ? 'Guardando paciente…'
                : 'Registrar paciente'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
