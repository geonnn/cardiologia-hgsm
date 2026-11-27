import { useRef, useState, type FormEvent } from 'react'
import { ChevronDownIcon } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  crearPaciente,
  FactoresRiesgoCombobox,
  listarFactoresDeRiesgoRequest,
  listarMedicosDeCabeceraRequest,
  MAX_LONGITUD_APELLIDO,
  MAX_LONGITUD_DNI,
  MAX_LONGITUD_MEDICO,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_PARENTESCO,
  MAX_LONGITUD_TELEFONO,
  MIN_LONGITUD_DNI,
  obtenerOCrearMedicoDeCabecera,
  validarContacto,
  validarDatosPaciente,
  type ErroresContacto,
  type ErroresPaciente,
  type FactorDeRiesgo,
  type MedicoDeCabecera,
  type Sexo,
} from '@/features/pacientes'
import { useApiQuery } from '@/hooks/useApiQuery'
import { api, mensajeDeError } from '@/lib/api'
import { hoyIso } from '@/lib/fechas'
import { obtenerPacientePorIdRequest, type PacienteDetalleDto } from '../api/internacionesApi'
import type { PacienteSeleccionado } from './PacienteBuscador'

interface NuevoPacienteRapidoDialogProps {
  open: boolean
  valorInicial?: string
  onOpenChange: (open: boolean) => void
  onCreado: (paciente: PacienteSeleccionado) => void
}

const inferirPrefill = (texto?: string): { dni: string; apellido: string } => {
  const limpio = texto?.trim() ?? ''
  if (!limpio) return { dni: '', apellido: '' }
  if (/^[A-Za-z0-9]{1,9}$/.test(limpio) && /\d/.test(limpio)) {
    return { dni: limpio, apellido: '' }
  }
  if (/^[\p{L}\s'-]+$/u.test(limpio)) {
    return { dni: '', apellido: limpio.slice(0, MAX_LONGITUD_APELLIDO) }
  }
  return { dni: '', apellido: '' }
}

const calcularEdadLocal = (fechaNacimiento: string): number => {
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number)
  if (!anio || !mes || !dia) return 0
  const hoy = new Date()
  let edad = hoy.getFullYear() - anio
  const mesActual = hoy.getMonth() + 1
  if (mesActual < mes || (mesActual === mes && hoy.getDate() < dia)) {
    edad -= 1
  }
  return Math.max(0, edad)
}

/** Modal de registro rápido de paciente durante el alta de internación (RF-24 + RF-47). */
export function NuevoPacienteRapidoDialog({
  open,
  valorInicial,
  onOpenChange,
  onCreado,
}: NuevoPacienteRapidoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
          <DialogTitle className="text-xl font-extrabold text-primary">
            Registrar nuevo paciente
          </DialogTitle>
          <DialogDescription>
            Completá los datos filiatorios obligatorios para registrarlo y seleccionarlo en esta
            internación sin perder lo cargado.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <NuevoPacienteRapidoForm
            valorInicial={valorInicial}
            onCreado={(paciente) => {
              onCreado(paciente)
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function NuevoPacienteRapidoForm({
  valorInicial,
  onCreado,
}: {
  valorInicial?: string
  onCreado: (paciente: PacienteSeleccionado) => void
}) {
  const prefill = inferirPrefill(valorInicial)
  const [hoyStr] = useState(hoyIso)

  const factoresQuery = useApiQuery<FactorDeRiesgo[]>(listarFactoresDeRiesgoRequest())
  const medicosQuery = useApiQuery<MedicoDeCabecera[]>(listarMedicosDeCabeceraRequest())

  // Campos obligatorios
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState(prefill.apellido)
  const [dni, setDni] = useState(prefill.dni)
  const [sexo, setSexo] = useState<Sexo>('Masculino')
  const [fechaNacimiento, setFechaNacimiento] = useState('')

  // Sección colapsable opcional
  const [opcionalesAbiertos, setOpcionalesAbiertos] = useState(false)
  const [medicoDeCabecera, setMedicoDeCabecera] = useState('')
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<number[]>([])
  const [antecedentes, setAntecedentes] = useState('')
  const [contactoNombre, setContactoNombre] = useState('')
  const [contactoTelefono, setContactoTelefono] = useState('')
  const [contactoApellido, setContactoApellido] = useState('')
  const [contactoParentesco, setContactoParentesco] = useState('')

  // Control y errores
  const [erroresPaciente, setErroresPaciente] = useState<ErroresPaciente>({})
  const [erroresContacto, setErroresContacto] = useState<ErroresContacto>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const nombreRef = useRef<HTMLInputElement>(null)
  const apellidoRef = useRef<HTMLInputElement>(null)
  const dniRef = useRef<HTMLInputElement>(null)
  const fechaNacRef = useRef<HTMLInputElement>(null)
  const medicoRef = useRef<HTMLInputElement>(null)
  const contactoNombreRef = useRef<HTMLInputElement>(null)
  const contactoTelefonoRef = useRef<HTMLInputElement>(null)

  const catalogosError = factoresQuery.error ?? medicosQuery.error
  const tieneAlgunDatoContacto = Boolean(
    contactoNombre.trim() ||
      contactoTelefono.trim() ||
      contactoApellido.trim() ||
      contactoParentesco.trim(),
  )

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacionPaciente = validarDatosPaciente({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      medicoDeCabecera,
    })

    const validacionContacto: ErroresContacto = tieneAlgunDatoContacto
      ? validarContacto({
          nombre: contactoNombre,
          telefono: contactoTelefono,
          apellido: contactoApellido,
          parentesco: contactoParentesco,
        })
      : {}

    setErroresPaciente(validacionPaciente)
    setErroresContacto(validacionContacto)

    const hayErroresPaciente = Object.keys(validacionPaciente).length > 0
    const hayErroresContacto = Object.keys(validacionContacto).length > 0
    if (hayErroresPaciente || hayErroresContacto) {
      if (validacionPaciente.nombre) nombreRef.current?.focus()
      else if (validacionPaciente.apellido) apellidoRef.current?.focus()
      else if (validacionPaciente.dni) dniRef.current?.focus()
      else if (validacionPaciente.fechaNacimiento) fechaNacRef.current?.focus()
      else {
        setOpcionalesAbiertos(true)
        requestAnimationFrame(() => {
          if (validacionPaciente.medicoDeCabecera) medicoRef.current?.focus()
          else if (validacionContacto.nombre) contactoNombreRef.current?.focus()
          else if (validacionContacto.telefono) contactoTelefonoRef.current?.focus()
        })
      }
      return
    }

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
        contactos: tieneAlgunDatoContacto
          ? [
              {
                nombre: contactoNombre.trim(),
                telefono: contactoTelefono.trim(),
                apellido: contactoApellido.trim() || null,
                parentesco: contactoParentesco.trim() || null,
              },
            ]
          : undefined,
      })

      let seleccionado: PacienteSeleccionado
      try {
        const { data } = await api.request<PacienteDetalleDto>(obtenerPacientePorIdRequest(nuevoId))
        seleccionado = {
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          edad: data.edad,
          sexo: data.sexo,
        }
      } catch {
        seleccionado = {
          id: nuevoId,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          dni: dni.trim(),
          edad: calcularEdadLocal(fechaNacimiento),
          sexo,
        }
      }

      onCreado(seleccionado)
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={enviar}
      className="flex min-h-0 flex-1 flex-col"
      aria-busy={enviando}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 py-4">
        {(errorServidor || catalogosError) && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorServidor ?? `No se pudieron cargar los catálogos: ${catalogosError}`}
          </div>
        )}

        <FieldGroup className="gap-3">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Datos personales obligatorios
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_145px_165px]">
            <Field data-invalid={erroresPaciente.nombre ? true : undefined}>
              <FieldLabel htmlFor="rapido-nombre">
                Nombre <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={nombreRef}
                id="rapido-nombre"
                name="nombre"
                required
                autoFocus
                maxLength={MAX_LONGITUD_NOMBRE}
                placeholder="Nombre"
                className="h-10"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (erroresPaciente.nombre) {
                    setErroresPaciente((prev) => ({ ...prev, nombre: undefined }))
                  }
                }}
                aria-invalid={erroresPaciente.nombre ? true : undefined}
              />
              {erroresPaciente.nombre && <FieldError>{erroresPaciente.nombre}</FieldError>}
            </Field>

            <Field data-invalid={erroresPaciente.apellido ? true : undefined}>
              <FieldLabel htmlFor="rapido-apellido">
                Apellido <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={apellidoRef}
                id="rapido-apellido"
                name="apellido"
                required
                maxLength={MAX_LONGITUD_APELLIDO}
                placeholder="Apellido"
                className="h-10"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value)
                  if (erroresPaciente.apellido) {
                    setErroresPaciente((prev) => ({ ...prev, apellido: undefined }))
                  }
                }}
                aria-invalid={erroresPaciente.apellido ? true : undefined}
              />
              {erroresPaciente.apellido && <FieldError>{erroresPaciente.apellido}</FieldError>}
            </Field>

            <Field data-invalid={erroresPaciente.dni ? true : undefined}>
              <FieldLabel htmlFor="rapido-dni">
                DNI <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={dniRef}
                id="rapido-dni"
                name="dni"
                required
                minLength={MIN_LONGITUD_DNI}
                maxLength={MAX_LONGITUD_DNI}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="7 a 9 caracteres"
                className="h-10"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value)
                  if (erroresPaciente.dni) {
                    setErroresPaciente((prev) => ({ ...prev, dni: undefined }))
                  }
                }}
                aria-invalid={erroresPaciente.dni ? true : undefined}
              />
              {erroresPaciente.dni && <FieldError>{erroresPaciente.dni}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="rapido-sexo">
                Sexo <span className="text-destructive">*</span>
              </FieldLabel>
              <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
                <SelectTrigger id="rapido-sexo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field
              data-invalid={erroresPaciente.fechaNacimiento ? true : undefined}
              className="sm:col-span-2 lg:col-span-1"
            >
              <FieldLabel htmlFor="rapido-nacimiento">
                F. Nacimiento <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                ref={fechaNacRef}
                id="rapido-nacimiento"
                name="fechaNacimiento"
                type="date"
                required
                max={hoyStr}
                className="h-10"
                value={fechaNacimiento}
                onChange={(e) => {
                  setFechaNacimiento(e.target.value)
                  if (erroresPaciente.fechaNacimiento) {
                    setErroresPaciente((prev) => ({ ...prev, fechaNacimiento: undefined }))
                  }
                }}
                aria-invalid={erroresPaciente.fechaNacimiento ? true : undefined}
              />
              {erroresPaciente.fechaNacimiento && (
                <FieldError>{erroresPaciente.fechaNacimiento}</FieldError>
              )}
            </Field>
          </div>
        </FieldGroup>

        {/* Sección colapsable opcional en dos columnas para aprovechar el ancho sin scroll */}
        <details
          open={opcionalesAbiertos}
          onToggle={(e) => setOpcionalesAbiertos(e.currentTarget.open)}
          className="group rounded-lg border bg-muted/20"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold tracking-wide text-primary uppercase select-none marker:hidden">
            <span>Perfil clínico y contacto familiar (opcional)</span>
            <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="grid grid-cols-1 gap-5 border-t px-4 py-4 lg:grid-cols-12">
            {/* Columna izquierda: perfil clínico */}
            <div className="flex flex-col gap-3.5 lg:col-span-7">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">
                Perfil clínico
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field data-invalid={erroresPaciente.medicoDeCabecera ? true : undefined}>
                  <FieldLabel htmlFor="rapido-medico">Médico de cabecera</FieldLabel>
                  <Input
                    ref={medicoRef}
                    id="rapido-medico"
                    name="medicoDeCabecera"
                    list="medicos-cabecera-rapido"
                    maxLength={MAX_LONGITUD_MEDICO}
                    placeholder="Nombre completo"
                    className="h-10 bg-card"
                    value={medicoDeCabecera}
                    onChange={(e) => setMedicoDeCabecera(e.target.value)}
                    aria-invalid={erroresPaciente.medicoDeCabecera ? true : undefined}
                  />
                  <datalist id="medicos-cabecera-rapido">
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
                <FieldLabel htmlFor="rapido-antecedentes">Antecedentes</FieldLabel>
                <Textarea
                  id="rapido-antecedentes"
                  name="antecedentes"
                  rows={2}
                  placeholder="Patologías crónicas, cirugías previas, alergias…"
                  className="bg-card"
                  value={antecedentes}
                  onChange={(e) => setAntecedentes(e.target.value)}
                />
              </Field>
            </div>

            {/* Columna derecha: contacto familiar */}
            <div className="flex flex-col gap-3.5 border-t pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">
                Contacto familiar
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field data-invalid={erroresContacto.nombre ? true : undefined}>
                  <FieldLabel htmlFor="rapido-contacto-nombre">Nombre</FieldLabel>
                  <Input
                    ref={contactoNombreRef}
                    id="rapido-contacto-nombre"
                    name="contactoNombre"
                    maxLength={MAX_LONGITUD_NOMBRE}
                    placeholder="Nombre"
                    className="h-10 bg-card"
                    value={contactoNombre}
                    onChange={(e) => setContactoNombre(e.target.value)}
                    aria-invalid={erroresContacto.nombre ? true : undefined}
                  />
                  {erroresContacto.nombre && <FieldError>{erroresContacto.nombre}</FieldError>}
                </Field>

                <Field data-invalid={erroresContacto.telefono ? true : undefined}>
                  <FieldLabel htmlFor="rapido-contacto-telefono">Teléfono</FieldLabel>
                  <Input
                    ref={contactoTelefonoRef}
                    id="rapido-contacto-telefono"
                    name="contactoTelefono"
                    inputMode="numeric"
                    maxLength={MAX_LONGITUD_TELEFONO}
                    placeholder="Sólo números"
                    className="h-10 bg-card"
                    value={contactoTelefono}
                    onChange={(e) => setContactoTelefono(e.target.value)}
                    aria-invalid={erroresContacto.telefono ? true : undefined}
                  />
                  {erroresContacto.telefono && <FieldError>{erroresContacto.telefono}</FieldError>}
                </Field>

                <Field data-invalid={erroresContacto.apellido ? true : undefined}>
                  <FieldLabel htmlFor="rapido-contacto-apellido">Apellido</FieldLabel>
                  <Input
                    id="rapido-contacto-apellido"
                    name="contactoApellido"
                    maxLength={MAX_LONGITUD_APELLIDO}
                    placeholder="Apellido"
                    className="h-10 bg-card"
                    value={contactoApellido}
                    onChange={(e) => setContactoApellido(e.target.value)}
                    aria-invalid={erroresContacto.apellido ? true : undefined}
                  />
                  {erroresContacto.apellido && <FieldError>{erroresContacto.apellido}</FieldError>}
                </Field>

                <Field data-invalid={erroresContacto.parentesco ? true : undefined}>
                  <FieldLabel htmlFor="rapido-contacto-parentesco">Parentesco</FieldLabel>
                  <Input
                    id="rapido-contacto-parentesco"
                    name="contactoParentesco"
                    maxLength={MAX_LONGITUD_PARENTESCO}
                    placeholder="Ej. Esposa, Hijo"
                    className="h-10 bg-card"
                    value={contactoParentesco}
                    onChange={(e) => setContactoParentesco(e.target.value)}
                    aria-invalid={erroresContacto.parentesco ? true : undefined}
                  />
                  {erroresContacto.parentesco && (
                    <FieldError>{erroresContacto.parentesco}</FieldError>
                  )}
                </Field>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Footer siempre visible al pie del modal */}
      <DialogFooter className="mx-0 mb-0 shrink-0 px-6 py-3.5">
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="h-10 px-5 font-semibold"
          disabled={enviando}
        >
          {enviando ? 'Registrando…' : 'Registrar y seleccionar'}
        </Button>
      </DialogFooter>
    </form>
  )
}
