import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { codigosDeError, mensajeDeError } from '@/lib/api'
import type { ObraSocial } from '../api/obrasSocialesApi'
import { MAX_LONGITUD_NOMBRE, validarNombreObraSocial } from '../validaciones'

/** Errores de la API que corresponden al campo "Nombre" (CatalogoErrors y validación del request). */
const ERRORES_DE_NOMBRE = ['Catalogo.NombreDuplicado', 'Catalogo.NombreRequerido', 'Catalogo.NombreMuyLargo', 'Nombre']

interface ObraSocialFormProps {
  /** Nombre con el que arranca el campo (al modificar, el nombre actual). */
  nombreInicial?: string
  /** Id de la obra social que se modifica: no cuenta como duplicada consigo misma. */
  excluirId?: number
  /** Para validar en el cliente que el nombre no se repita. */
  existentes: ReadonlyArray<ObraSocial>
  /** Envía el nombre a la API. Si rechaza, el error se muestra en el formulario. */
  onSubmit: (nombre: string) => Promise<unknown>
  /** Botones del pie (se renderizan dentro del <form>). Reciben si hay un envío en curso. */
  acciones?: (estado: { enviando: boolean }) => ReactNode
}

/** Formulario de alta y modificación de obra social (RF-20 / RF-22). */
export function ObraSocialForm({ nombreInicial = '', excluirId, existentes, onSubmit, acciones }: ObraSocialFormProps) {
  const [nombre, setNombre] = useState(nombreInicial)
  // Los errores se muestran recién después del primer intento de envío, y luego se actualizan en vivo.
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // Errores devueltos por la API (ej. 409 nombre duplicado). Se limpian al editar.
  const [errorServidorNombre, setErrorServidorNombre] = useState<string | null>(null)
  const [errorServidorGeneral, setErrorServidorGeneral] = useState<string | null>(null)
  const nombreRef = useRef<HTMLInputElement>(null)

  const errorCliente = intentoEnviar ? validarNombreObraSocial(nombre, existentes, excluirId) : undefined
  const errorNombre = errorCliente ?? errorServidorNombre
  const longitud = nombre.trim().length

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setIntentoEnviar(true)
    setErrorServidorNombre(null)
    setErrorServidorGeneral(null)

    if (validarNombreObraSocial(nombre, existentes, excluirId)) {
      nombreRef.current?.focus()
      return
    }

    setEnviando(true)
    try {
      await onSubmit(nombre.trim())
    } catch (error) {
      const mensaje = mensajeDeError(error)
      if (codigosDeError(error).some((c) => ERRORES_DE_NOMBRE.includes(c))) {
        setErrorServidorNombre(mensaje)
        nombreRef.current?.focus()
      } else {
        setErrorServidorGeneral(mensaje)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="grid gap-6" aria-busy={enviando}>
      <FieldGroup>
        <Field data-invalid={errorNombre ? true : undefined}>
          <FieldLabel htmlFor="obra-social-nombre">
            Nombre <span className="text-destructive" aria-hidden="true">*</span>
          </FieldLabel>
          <Input
            id="obra-social-nombre"
            ref={nombreRef}
            required
            autoFocus
            autoComplete="off"
            // Margen para espacios al inicio o al final, que se recortan al guardar
            maxLength={MAX_LONGITUD_NOMBRE + 10}
            placeholder="Ej. PAMI"
            className="h-11 text-base"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              setErrorServidorNombre(null)
              setErrorServidorGeneral(null)
            }}
            aria-invalid={errorNombre ? true : undefined}
            aria-describedby={errorNombre ? 'obra-social-nombre-error' : 'obra-social-nombre-ayuda'}
          />
          {errorNombre ? (
            <FieldError id="obra-social-nombre-error">{errorNombre}</FieldError>
          ) : (
            <FieldDescription id="obra-social-nombre-ayuda" className="flex justify-between gap-3">
              <span>Único, hasta {MAX_LONGITUD_NOMBRE} caracteres.</span>
              <span className="tabular-nums" aria-hidden="true">
                {longitud}/{MAX_LONGITUD_NOMBRE}
              </span>
            </FieldDescription>
          )}
        </Field>

        {errorServidorGeneral && <FieldError>{errorServidorGeneral}</FieldError>}
      </FieldGroup>

      {acciones?.({ enviando })}
    </form>
  )
}
