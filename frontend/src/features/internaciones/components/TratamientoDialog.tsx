import { useState, type FormEvent } from 'react'
import { CopyIcon } from 'lucide-react'
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mensajeDeError } from '@/lib/api'
import { ahoraInputLocal, inputLocalAIsoUtc, isoAInputLocal } from '@/lib/fechas'
import type { Tratamiento } from '../api/internacionesApi'
import { MAX_MESES_DESFASAJE_TRATAMIENTO } from '../constants'
import { validarTratamiento, type ErroresTratamiento } from '../validaciones'

interface TratamientoDialogProps {
  open: boolean
  tratamiento?: Tratamiento | null
  esquemaVigente?: string | null
  onOpenChange: (open: boolean) => void
  onGuardar: (payload: { descripcion: string; fecha: string | null }) => Promise<unknown>
}

/** Modal de alta (HU-25 / RF-40) y edición del último tratamiento vigente (HU-27 / RF-42). */
export function TratamientoDialog({
  open,
  tratamiento,
  esquemaVigente,
  onOpenChange,
  onGuardar,
}: TratamientoDialogProps) {
  const esEdicion = Boolean(tratamiento)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            {esEdicion ? 'Editar tratamiento vigente' : 'Nuevo tratamiento'}
          </DialogTitle>
          <DialogDescription>
            {esEdicion
              ? 'Modificá la descripción y/o fecha del último esquema de indicaciones registrado.'
              : 'Registrá las indicaciones médicas, fármacos y dosis vigentes para esta internación.'}
          </DialogDescription>
        </DialogHeader>

        <TratamientoForm
          key={tratamiento?.id ?? 'nuevo'}
          tratamiento={tratamiento}
          esquemaVigente={esquemaVigente}
          onSubmit={async (payload) => {
            await onGuardar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function TratamientoForm({
  tratamiento,
  esquemaVigente,
  onSubmit,
}: {
  tratamiento?: Tratamiento | null
  esquemaVigente?: string | null
  onSubmit: (payload: { descripcion: string; fecha: string | null }) => Promise<void>
}) {
  const esEdicion = Boolean(tratamiento)
  const [fechaInicial] = useState(() =>
    tratamiento ? isoAInputLocal(tratamiento.fecha) : ahoraInputLocal(),
  )
  const [fecha, setFecha] = useState(fechaInicial)
  const [descripcion, setDescripcion] = useState(tratamiento?.descripcion ?? '')
  const [errores, setErrores] = useState<ErroresTratamiento>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const fechaModificada = !esEdicion || fecha !== fechaInicial
    const validacion = validarTratamiento({
      descripcion,
      fecha,
      validarFecha: fechaModificada,
    })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        descripcion: descripcion.trim(),
        fecha: fechaModificada && fecha ? inputLocalAIsoUtc(fecha) : null,
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
          <FieldLabel htmlFor="tratamiento-fecha">Fecha y hora</FieldLabel>
          <Input
            id="tratamiento-fecha"
            type="datetime-local"
            className="h-10 sm:max-w-xs"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value)
              if (errores.fecha) setErrores((prev) => ({ ...prev, fecha: undefined }))
            }}
            aria-invalid={errores.fecha ? true : undefined}
          />
          <FieldDescription>
            {esEdicion
              ? `Si modificás la fecha, debe estar dentro de ±${MAX_MESES_DESFASAJE_TRATAMIENTO} meses respecto a la fecha actual.`
              : `Se precarga con la fecha actual. Se admiten fechas dentro de ±${MAX_MESES_DESFASAJE_TRATAMIENTO} meses.`}
          </FieldDescription>
          {errores.fecha && <FieldError>{errores.fecha}</FieldError>}
        </Field>

        <Field data-invalid={errores.descripcion ? true : undefined}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FieldLabel htmlFor="tratamiento-descripcion">
              Descripción e indicaciones <span className="text-destructive">*</span>
            </FieldLabel>
            {!esEdicion && esquemaVigente && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                  setDescripcion(esquemaVigente)
                  if (errores.descripcion) {
                    setErrores((prev) => ({ ...prev, descripcion: undefined }))
                  }
                }}
              >
                <CopyIcon className="size-3.5" />
                <span>Copiar esquema vigente</span>
              </Button>
            )}
          </div>
          <Textarea
            id="tratamiento-descripcion"
            rows={7}
            placeholder="Ej.: AAS 100 mg/día VO, Clopidogrel 75 mg/día VO, Atorvastatina 80 mg/día, Furosemida 20 mg c/12 h EV…"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              if (errores.descripcion) setErrores((prev) => ({ ...prev, descripcion: undefined }))
            }}
            aria-invalid={errores.descripcion ? true : undefined}
            autoFocus
          />
          {errores.descripcion && <FieldError>{errores.descripcion}</FieldError>}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="brand" size="lg" className="h-10 px-4" disabled={enviando}>
          {enviando
            ? 'Guardando…'
            : esEdicion
              ? 'Guardar cambios'
              : 'Registrar tratamiento'}
        </Button>
      </DialogFooter>
    </form>
  )
}
