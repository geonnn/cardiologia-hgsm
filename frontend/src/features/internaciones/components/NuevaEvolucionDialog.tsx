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
import { Textarea } from '@/components/ui/textarea'
import { mensajeDeError } from '@/lib/api'
import { ahoraInputLocal, inputLocalAIsoUtc } from '@/lib/fechas'
import type { CrearEvolucionRequest } from '../api/internacionesApi'
import { validarNuevaEvolucion, type ErroresNuevaEvolucion } from '../validaciones'

interface NuevaEvolucionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuardar: (payload: CrearEvolucionRequest) => Promise<unknown>
}

/** Modal de registro de nota de evolución clínica para una internación activa (HU-23 / RF-38). */
export function NuevaEvolucionDialog({
  open,
  onOpenChange,
  onGuardar,
}: NuevaEvolucionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Nueva evolución clínica
          </DialogTitle>
          <DialogDescription>
            Documentá el estado clínico actual, novedades del pase de sala y respuesta terapéutica.
          </DialogDescription>
        </DialogHeader>

        <NuevaEvolucionForm
          onSubmit={async (payload) => {
            await onGuardar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function NuevaEvolucionForm({
  onSubmit,
}: {
  onSubmit: (payload: CrearEvolucionRequest) => Promise<void>
}) {
  const [ahoraStr] = useState(ahoraInputLocal)
  const [fecha, setFecha] = useState(ahoraStr)
  const [detalle, setDetalle] = useState('')
  const [errores, setErrores] = useState<ErroresNuevaEvolucion>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarNuevaEvolucion({ fecha, detalle })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        fecha: inputLocalAIsoUtc(fecha),
        detalle: detalle.trim(),
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
        <Field data-invalid={errores.fecha ? true : undefined}>
          <FieldLabel htmlFor="evolucion-fecha">
            Fecha y hora de evolución <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="evolucion-fecha"
            type="datetime-local"
            max={ahoraStr}
            className="h-10 sm:max-w-xs"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value)
              if (errores.fecha) setErrores((prev) => ({ ...prev, fecha: undefined }))
            }}
            aria-invalid={errores.fecha ? true : undefined}
          />
          {errores.fecha && <FieldError>{errores.fecha}</FieldError>}
        </Field>

        <Field data-invalid={errores.detalle ? true : undefined}>
          <FieldLabel htmlFor="evolucion-detalle">
            Detalle de la evolución <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="evolucion-detalle"
            rows={7}
            placeholder="Paciente estable hemodinámicamente, afebril, sin ángor ni disnea. ECG sin cambios agudos…"
            value={detalle}
            onChange={(e) => {
              setDetalle(e.target.value)
              if (errores.detalle) setErrores((prev) => ({ ...prev, detalle: undefined }))
            }}
            aria-invalid={errores.detalle ? true : undefined}
            autoFocus
          />
          {errores.detalle && <FieldError>{errores.detalle}</FieldError>}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="brand" size="lg" className="h-10 px-4" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Registrar evolución'}
        </Button>
      </DialogFooter>
    </form>
  )
}
