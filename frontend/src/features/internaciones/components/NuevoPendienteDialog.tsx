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
import type { AgregarPendienteRequest } from '../api/internacionesApi'
import { MAX_LONGITUD_TITULO_PENDIENTE } from '../constants'
import { validarNuevoPendiente, type ErroresNuevoPendiente } from '../validaciones'

interface NuevoPendienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuardar: (payload: AgregarPendienteRequest) => Promise<unknown>
}

/** Modal de alta de pendiente asistencial para una internación activa (HU-32 / RF-44). */
export function NuevoPendienteDialog({
  open,
  onOpenChange,
  onGuardar,
}: NuevoPendienteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            Nuevo pendiente
          </DialogTitle>
          <DialogDescription>
            Registrá una tarea, estudio o interconsulta pendiente para esta internación.
          </DialogDescription>
        </DialogHeader>

        <NuevoPendienteForm
          onSubmit={async (payload) => {
            await onGuardar(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function NuevoPendienteForm({
  onSubmit,
}: {
  onSubmit: (payload: AgregarPendienteRequest) => Promise<void>
}) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [errores, setErrores] = useState<ErroresNuevoPendiente>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const validacion = validarNuevoPendiente({ titulo, descripcion })
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
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
        <Field data-invalid={errores.titulo ? true : undefined}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="pendiente-titulo">
              Título <span className="text-destructive">*</span>
            </FieldLabel>
            <span className="text-xs text-muted-foreground tabular-nums">
              {titulo.length}/{MAX_LONGITUD_TITULO_PENDIENTE}
            </span>
          </div>
          <Input
            id="pendiente-titulo"
            maxLength={MAX_LONGITUD_TITULO_PENDIENTE}
            placeholder="Ej.: Ecocardiograma de control"
            className="h-10"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value)
              if (errores.titulo) setErrores((prev) => ({ ...prev, titulo: undefined }))
            }}
            aria-invalid={errores.titulo ? true : undefined}
            autoFocus
          />
          {errores.titulo && <FieldError>{errores.titulo}</FieldError>}
        </Field>

        <Field data-invalid={errores.descripcion ? true : undefined}>
          <FieldLabel htmlFor="pendiente-descripcion">
            Descripción <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="pendiente-descripcion"
            rows={4}
            placeholder="Detallá el estudio, interconsulta o acción asistencial a realizar…"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              if (errores.descripcion) setErrores((prev) => ({ ...prev, descripcion: undefined }))
            }}
            aria-invalid={errores.descripcion ? true : undefined}
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
          {enviando ? 'Guardando…' : 'Agregar pendiente'}
        </Button>
      </DialogFooter>
    </form>
  )
}
