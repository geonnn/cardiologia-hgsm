import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { codigosDeError, mensajeDeError } from '@/lib/api'
import type { CatalogoConfig, ItemCatalogo } from '../types'
import { validarNombreCatalogo } from '../validaciones'

/** Errores de la API que corresponden al campo "Nombre" (CatalogoErrors y validación del request). */
const ERRORES_DE_NOMBRE = ['Catalogo.NombreDuplicado', 'Catalogo.NombreRequerido', 'Catalogo.NombreMuyLargo', 'Nombre']

interface CatalogoFormProps {
  config: CatalogoConfig
  /** Nombre con el que arranca el campo (al modificar, el nombre actual). */
  nombreInicial?: string
  /** Id del elemento que se modifica: no cuenta como duplicado consigo mismo. */
  excluirId?: number
  /** Para validar en el cliente que el nombre no se repita. */
  existentes: ReadonlyArray<ItemCatalogo>
  /** Envía el nombre a la API. Si rechaza, el error se muestra en el formulario. */
  onSubmit: (nombre: string) => Promise<unknown>
  /** Botones del pie (se renderizan dentro del <form>). Reciben si hay un envío en curso. */
  acciones?: (estado: { enviando: boolean }) => ReactNode
}

/** Formulario de alta y modificación de un elemento del catálogo (solo tiene nombre). */
export function CatalogoForm({ config, nombreInicial = '', excluirId, existentes, onSubmit, acciones }: CatalogoFormProps) {
  const id = useId()
  const [nombre, setNombre] = useState(nombreInicial)
  // Los errores se muestran recién después del primer intento de envío, y luego se actualizan en vivo.
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // Errores devueltos por la API (ej. 409 nombre duplicado). Se limpian al editar.
  const [errorServidorNombre, setErrorServidorNombre] = useState<string | null>(null)
  const [errorServidorGeneral, setErrorServidorGeneral] = useState<string | null>(null)
  const nombreRef = useRef<HTMLInputElement>(null)

  const validar = () => validarNombreCatalogo(config, nombre, existentes, excluirId)
  const errorNombre = (intentoEnviar ? validar() : undefined) ?? errorServidorNombre
  const max = config.maxLongitudNombre

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setIntentoEnviar(true)
    setErrorServidorNombre(null)
    setErrorServidorGeneral(null)

    if (validar()) {
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
          <FieldLabel htmlFor={`${id}-nombre`}>
            Nombre <span className="text-destructive" aria-hidden="true">*</span>
          </FieldLabel>
          <Input
            id={`${id}-nombre`}
            ref={nombreRef}
            required
            autoFocus
            autoComplete="off"
            // Margen para espacios al inicio o al final, que se recortan al guardar
            maxLength={max + 10}
            placeholder={`Ej. ${config.ejemploNombre}`}
            className="h-11 text-base"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              setErrorServidorNombre(null)
              setErrorServidorGeneral(null)
            }}
            aria-invalid={errorNombre ? true : undefined}
            aria-describedby={errorNombre ? `${id}-error` : `${id}-ayuda`}
          />
          {errorNombre ? (
            <FieldError id={`${id}-error`}>{errorNombre}</FieldError>
          ) : (
            <FieldDescription id={`${id}-ayuda`} className="flex justify-between gap-3">
              <span>Único, hasta {max} caracteres.</span>
              <span className="tabular-nums" aria-hidden="true">
                {nombre.trim().length}/{max}
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
