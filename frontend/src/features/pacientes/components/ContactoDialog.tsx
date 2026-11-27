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
import { mensajeDeError } from '@/lib/api'
import type { Contacto, ContactoInput } from '../api/pacientesApi'
import {
  MAX_LONGITUD_APELLIDO,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_PARENTESCO,
  MAX_LONGITUD_TELEFONO,
  validarContacto,
  type ErroresContacto,
} from '../validaciones'

interface ContactoDialogProps {
  open: boolean
  contacto?: Contacto
  onOpenChange: (open: boolean) => void
  onGuardar: (contactoId: string | null, datos: ContactoInput) => Promise<unknown>
}

/** Modal de alta o modificación de contacto familiar (RF-25). */
export function ContactoDialog({ open, contacto, onOpenChange, onGuardar }: ContactoDialogProps) {
  const esEdicion = contacto !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            {esEdicion ? 'Modificar contacto' : 'Agregar contacto'}
          </DialogTitle>
          <DialogDescription>
            {esEdicion
              ? 'Actualizá los datos de contacto del paciente.'
              : 'Ingresá los datos del contacto familiar o de emergencia.'}
          </DialogDescription>
        </DialogHeader>

        <ContactoForm
          contacto={contacto}
          onSubmit={async (datos) => {
            await onGuardar(contacto?.id ?? null, datos)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function ContactoForm({
  contacto,
  onSubmit,
}: {
  contacto?: Contacto
  onSubmit: (datos: ContactoInput) => Promise<void>
}) {
  const [nombre, setNombre] = useState(contacto?.nombre ?? '')
  const [apellido, setApellido] = useState(contacto?.apellido ?? '')
  const [telefono, setTelefono] = useState(contacto?.telefono ?? '')
  const [parentesco, setParentesco] = useState(contacto?.parentesco ?? '')
  const [errores, setErrores] = useState<ErroresContacto>({})
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setErrorServidor(null)

    const payload: ContactoInput = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      apellido: apellido.trim() || null,
      parentesco: parentesco.trim() || null,
    }

    const validacion = validarContacto(payload)
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) return

    setEnviando(true)
    try {
      await onSubmit(payload)
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={errores.nombre ? true : undefined}>
            <FieldLabel htmlFor="contacto-nombre">
              Nombre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="contacto-nombre"
              maxLength={MAX_LONGITUD_NOMBRE}
              placeholder="Nombre del contacto"
              className="h-10"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={errores.nombre ? true : undefined}
            />
            {errores.nombre && <FieldError>{errores.nombre}</FieldError>}
          </Field>

          <Field data-invalid={errores.apellido ? true : undefined}>
            <FieldLabel htmlFor="contacto-apellido">Apellido (opcional)</FieldLabel>
            <Input
              id="contacto-apellido"
              maxLength={MAX_LONGITUD_APELLIDO}
              placeholder="Apellido del contacto"
              className="h-10"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              aria-invalid={errores.apellido ? true : undefined}
            />
            {errores.apellido && <FieldError>{errores.apellido}</FieldError>}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={errores.telefono ? true : undefined}>
            <FieldLabel htmlFor="contacto-telefono">
              Teléfono <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="contacto-telefono"
              maxLength={MAX_LONGITUD_TELEFONO}
              placeholder="Sólo números"
              className="h-10"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              aria-invalid={errores.telefono ? true : undefined}
            />
            {errores.telefono && <FieldError>{errores.telefono}</FieldError>}
          </Field>

          <Field data-invalid={errores.parentesco ? true : undefined}>
            <FieldLabel htmlFor="contacto-parentesco">Parentesco (opcional)</FieldLabel>
            <Input
              id="contacto-parentesco"
              maxLength={MAX_LONGITUD_PARENTESCO}
              placeholder="Ej. Esposa, Hijo"
              className="h-10"
              value={parentesco}
              onChange={(e) => setParentesco(e.target.value)}
              aria-invalid={errores.parentesco ? true : undefined}
            />
            {errores.parentesco && <FieldError>{errores.parentesco}</FieldError>}
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4" disabled={enviando}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="brand" size="lg" className="h-10 px-4" disabled={enviando}>
          {enviando ? 'Guardando…' : contacto ? 'Guardar cambios' : 'Agregar contacto'}
        </Button>
      </DialogFooter>
    </form>
  )
}
