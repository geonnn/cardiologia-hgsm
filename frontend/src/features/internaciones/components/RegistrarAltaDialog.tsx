import { useState, type FormEvent } from 'react'
import { InfoIcon } from 'lucide-react'
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
import { mensajeDeError } from '@/lib/api'
import { ahoraInputLocal, inputLocalAIsoUtc } from '@/lib/fechas'
import type { CondicionAlta, RegistrarAltaPayload } from '../api/internacionesApi'
import { CONDICIONES_ALTA } from '../constants'
import { validarRegistrarAlta, type ErroresRegistrarAlta } from '../validaciones'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

interface RegistrarAltaDialogProps {
  open: boolean
  pacienteNombre: string
  camaDescripcion: string
  fechaIngresoIso?: string
  onOpenChange: (open: boolean) => void
  onConfirmar: (payload: RegistrarAltaPayload) => Promise<unknown>
}

/** Modal de cierre de internación y alta hospitalaria (HU-22 / RF-50). */
export function RegistrarAltaDialog({
  open,
  pacienteNombre,
  camaDescripcion,
  fechaIngresoIso,
  onOpenChange,
  onConfirmar,
}: RegistrarAltaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Registrar fin de internación
          </DialogTitle>
          <DialogDescription>
            Confirmá la condición y fecha de egreso de{' '}
            <strong className="text-foreground">{pacienteNombre}</strong>.
          </DialogDescription>
        </DialogHeader>

        <RegistrarAltaForm
          camaDescripcion={camaDescripcion}
          fechaIngresoIso={fechaIngresoIso}
          onSubmit={async (payload) => {
            await onConfirmar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function RegistrarAltaForm({
  camaDescripcion,
  fechaIngresoIso,
  onSubmit,
}: {
  camaDescripcion: string
  fechaIngresoIso?: string
  onSubmit: (payload: RegistrarAltaPayload) => Promise<void>
}) {
  const [ahoraStr] = useState(ahoraInputLocal)
  const [condicionAlta, setCondicionAlta] = useState<CondicionAlta>('AltaHospitalaria')
  const [fechaFin, setFechaFin] = useState(ahoraStr)
  const [errores, setErrores] = useState<ErroresRegistrarAlta>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarRegistrarAlta({
      condicionAlta,
      fechaFin,
      fechaIngresoIso,
    })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        condicionAlta,
        fechaFin: inputLocalAIsoUtc(fechaFin),
      })
    } catch (err: unknown) {
      setErrorServidor(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="grid gap-5" aria-busy={enviando}>
      {errorServidor && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorServidor}
        </div>
      )}

      <FieldGroup className="gap-4">
        <Field data-invalid={errores.condicionAlta ? true : undefined}>
          <FieldLabel htmlFor="alta-condicion">
            Condición de alta <span className="text-destructive">*</span>
          </FieldLabel>
          <select
            id="alta-condicion"
            className={SELECT_CLASS}
            value={condicionAlta}
            onChange={(e) => setCondicionAlta(e.target.value as CondicionAlta)}
            aria-invalid={errores.condicionAlta ? true : undefined}
          >
            {CONDICIONES_ALTA.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errores.condicionAlta && <FieldError>{errores.condicionAlta}</FieldError>}
        </Field>

        <Field data-invalid={errores.fechaFin ? true : undefined}>
          <FieldLabel htmlFor="alta-fecha">
            Fecha y hora de egreso <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="alta-fecha"
            type="datetime-local"
            max={ahoraStr}
            className="h-10"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            aria-invalid={errores.fechaFin ? true : undefined}
          />
          {errores.fechaFin && <FieldError>{errores.fechaFin}</FieldError>}
        </Field>
      </FieldGroup>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs text-primary">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <span>
          Al confirmar el egreso, la cama <strong>{camaDescripcion}</strong> pasará automáticamente
          a estado <strong>Disponible</strong> y la internación quedará cerrada.
        </span>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="brand" size="lg" className="h-10 px-4" disabled={enviando}>
          {enviando ? 'Registrando egreso…' : 'Confirmar egreso'}
        </Button>
      </DialogFooter>
    </form>
  )
}
