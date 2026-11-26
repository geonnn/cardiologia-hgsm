import { useState, type FormEvent } from 'react'
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
import { hoyIso } from '@/lib/fechas'
import {
  listarFactoresDeRiesgoRequest,
  listarMedicosDeCabeceraRequest,
  type FactorDeRiesgo,
  type MedicoDeCabecera,
} from '../api/catalogosApi'
import type { ModificarPacientePayload, PacienteDetalle, Sexo } from '../api/pacientesApi'
import {
  MAX_LONGITUD_APELLIDO,
  MAX_LONGITUD_DNI,
  MAX_LONGITUD_MEDICO,
  MAX_LONGITUD_NOMBRE,
  validarDatosPaciente,
  type ErroresPaciente,
} from '../validaciones'
import { FactoresRiesgoCombobox } from './FactoresRiesgoCombobox'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export type GuardarDatosPacienteInput = Omit<ModificarPacientePayload, 'medicoDeCabeceraId'> & {
  medicoDeCabeceraNombre: string
  factorDeRiesgoIds: number[]
}

interface EditarPacienteDialogProps {
  open: boolean
  paciente: PacienteDetalle
  onOpenChange: (open: boolean) => void
  onGuardar: (datos: GuardarDatosPacienteInput) => Promise<unknown>
}

/** Modal de edición de datos filiatorios y perfil clínico del paciente (RF-25). */
export function EditarPacienteDialog({
  open,
  paciente,
  onOpenChange,
  onGuardar,
}: EditarPacienteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Modificar datos del paciente
          </DialogTitle>
          <DialogDescription>
            Actualizá los datos filiatorios, antecedentes, médico de cabecera y factores de riesgo.
          </DialogDescription>
        </DialogHeader>

        <EditarPacienteForm
          paciente={paciente}
          onSubmit={async (datos) => {
            await onGuardar(datos)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditarPacienteForm({
  paciente,
  onSubmit,
}: {
  paciente: PacienteDetalle
  onSubmit: (datos: GuardarDatosPacienteInput) => Promise<void>
}) {
  const [hoyStr] = useState(hoyIso)
  const factoresQuery = useApiQuery<FactorDeRiesgo[]>(listarFactoresDeRiesgoRequest())
  const medicosQuery = useApiQuery<MedicoDeCabecera[]>(listarMedicosDeCabeceraRequest())

  const [nombre, setNombre] = useState(paciente.nombre)
  const [apellido, setApellido] = useState(paciente.apellido)
  const [dni, setDni] = useState(paciente.dni)
  const [sexo, setSexo] = useState<Sexo>(paciente.sexo)
  const [fechaNacimiento, setFechaNacimiento] = useState(paciente.fechaNacimiento)
  const [medicoDeCabecera, setMedicoDeCabecera] = useState(paciente.medicoDeCabecera?.nombre ?? '')
  const [antecedentes, setAntecedentes] = useState(paciente.antecedentes ?? '')
  const [factoresSeleccionados, setFactoresSeleccionados] = useState<number[]>(
    paciente.factoresDeRiesgo.map((f) => f.id),
  )

  const [errores, setErrores] = useState<ErroresPaciente>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const catalogosError = factoresQuery.error ?? medicosQuery.error

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarDatosPaciente({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      medicoDeCabecera,
    })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        sexo,
        fechaNacimiento,
        antecedentes: antecedentes.trim() || null,
        medicoDeCabeceraNombre: medicoDeCabecera.trim(),
        factorDeRiesgoIds: factoresSeleccionados,
      })
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="grid gap-5" aria-busy={enviando}>
      {(errorServidor || catalogosError) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorServidor ?? `No se pudieron cargar los catálogos: ${catalogosError}`}
        </div>
      )}

      <FieldGroup className="gap-4">
        <p className="text-xs font-bold tracking-wide text-primary uppercase">Datos personales</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={errores.nombre ? true : undefined}>
            <FieldLabel htmlFor="editar-nombre">
              Nombre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="editar-nombre"
              maxLength={MAX_LONGITUD_NOMBRE}
              className="h-10"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={errores.nombre ? true : undefined}
            />
            {errores.nombre && <FieldError>{errores.nombre}</FieldError>}
          </Field>

          <Field data-invalid={errores.apellido ? true : undefined}>
            <FieldLabel htmlFor="editar-apellido">
              Apellido <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="editar-apellido"
              maxLength={MAX_LONGITUD_APELLIDO}
              className="h-10"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              aria-invalid={errores.apellido ? true : undefined}
            />
            {errores.apellido && <FieldError>{errores.apellido}</FieldError>}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field data-invalid={errores.dni ? true : undefined}>
            <FieldLabel htmlFor="editar-dni">
              DNI <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="editar-dni"
              maxLength={MAX_LONGITUD_DNI}
              className="h-10"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              aria-invalid={errores.dni ? true : undefined}
            />
            {errores.dni && <FieldError>{errores.dni}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="editar-sexo">Sexo</FieldLabel>
            <select
              id="editar-sexo"
              className={SELECT_CLASS}
              value={sexo}
              onChange={(e) => setSexo(e.target.value as Sexo)}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </Field>

          <Field data-invalid={errores.fechaNacimiento ? true : undefined}>
            <FieldLabel htmlFor="editar-nacimiento">F. Nacimiento</FieldLabel>
            <Input
              id="editar-nacimiento"
              type="date"
              max={hoyStr}
              className="h-10"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              aria-invalid={errores.fechaNacimiento ? true : undefined}
            />
            {errores.fechaNacimiento && <FieldError>{errores.fechaNacimiento}</FieldError>}
          </Field>
        </div>

        <Separator />
        <p className="text-xs font-bold tracking-wide text-primary uppercase">Perfil clínico</p>

        <Field data-invalid={errores.medicoDeCabecera ? true : undefined}>
          <FieldLabel htmlFor="editar-medico">Médico de cabecera</FieldLabel>
          <Input
            id="editar-medico"
            list="medicos-cabecera-editar"
            maxLength={MAX_LONGITUD_MEDICO}
            placeholder="Nombre del médico…"
            className="h-10"
            value={medicoDeCabecera}
            onChange={(e) => setMedicoDeCabecera(e.target.value)}
            aria-invalid={errores.medicoDeCabecera ? true : undefined}
          />
          <datalist id="medicos-cabecera-editar">
            {(medicosQuery.data ?? []).map((m) => (
              <option key={m.id} value={m.nombre} />
            ))}
          </datalist>
          {errores.medicoDeCabecera && <FieldError>{errores.medicoDeCabecera}</FieldError>}
        </Field>

        <FactoresRiesgoCombobox
          label="Factores de riesgo cardiovascular"
          placeholder="Buscar factor de riesgo…"
          options={factoresQuery.data ?? []}
          selectedIds={factoresSeleccionados}
          onChange={setFactoresSeleccionados}
        />

        <Field>
          <FieldLabel htmlFor="editar-antecedentes">Antecedentes</FieldLabel>
          <Textarea
            id="editar-antecedentes"
            rows={3}
            value={antecedentes}
            onChange={(e) => setAntecedentes(e.target.value)}
          />
        </Field>
      </FieldGroup>

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
