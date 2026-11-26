import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { codigosDeError, mensajeDeError } from '@/lib/api'
import type { Cama, NuevaCama, Sector } from '../types'
import { tieneErrores, validarNuevaCama } from '../validaciones'
import { SectorSelector } from './SectorSelector'

/** Errores de la API que corresponden al campo "Número de cama". */
const ERRORES_DE_NUMERO = ['Cama.NumeroDuplicado', 'Cama.NumeroInvalido', 'NumeroCama']

interface NuevaCamaFormProps {
  /** Sector preseleccionado (por defecto, el que se está viendo). */
  sectorInicial: Sector
  /** Para validar en el cliente que el número no se repita dentro del sector. */
  camasExistentes: ReadonlyArray<Cama>
  /** Envía la cama a la API. Si rechaza, el error se muestra en el formulario. */
  onSubmit: (cama: NuevaCama) => Promise<unknown>
  /** Botones del pie (se renderizan dentro del <form>). Reciben si hay un envío en curso. */
  acciones?: (estado: { enviando: boolean }) => ReactNode
}

/** Formulario de alta de cama (RF-10). */
export function NuevaCamaForm({ sectorInicial, camasExistentes, onSubmit, acciones }: NuevaCamaFormProps) {
  const [numero, setNumero] = useState('')
  const [sector, setSector] = useState(sectorInicial)
  // Los errores se muestran recién después del primer intento de envío, y luego se actualizan en vivo.
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // Errores devueltos por la API (ej. 409 número duplicado). Se limpian al editar.
  const [errorServidorNumero, setErrorServidorNumero] = useState<string | null>(null)
  const [errorServidorGeneral, setErrorServidorGeneral] = useState<string | null>(null)
  const numeroRef = useRef<HTMLInputElement>(null)

  const erroresCliente = intentoEnviar ? validarNuevaCama({ numero, sector }, camasExistentes) : {}
  const errorNumero = erroresCliente.numero ?? errorServidorNumero

  const limpiarErroresServidor = () => {
    setErrorServidorNumero(null)
    setErrorServidorGeneral(null)
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (enviando) return
    setIntentoEnviar(true)
    limpiarErroresServidor()

    if (tieneErrores(validarNuevaCama({ numero, sector }, camasExistentes))) {
      numeroRef.current?.focus()
      return
    }

    setEnviando(true)
    try {
      await onSubmit({ numero: Number(numero.trim()), sector })
    } catch (error) {
      const mensaje = mensajeDeError(error)
      if (codigosDeError(error).some((c) => ERRORES_DE_NUMERO.includes(c))) {
        setErrorServidorNumero(mensaje)
        numeroRef.current?.focus()
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
        <Field data-invalid={errorNumero ? true : undefined}>
          <FieldLabel htmlFor="nueva-cama-numero">
            Número de cama <span className="text-destructive" aria-hidden="true">*</span>
          </FieldLabel>
          <Input
            id="nueva-cama-numero"
            ref={numeroRef}
            required
            autoFocus
            inputMode="numeric"
            autoComplete="off"
            maxLength={9}
            placeholder="Ej. 9"
            className="h-11 text-base"
            value={numero}
            onChange={(e) => {
              setNumero(e.target.value)
              limpiarErroresServidor()
            }}
            aria-invalid={errorNumero ? true : undefined}
            aria-describedby={errorNumero ? 'nueva-cama-numero-error' : 'nueva-cama-numero-ayuda'}
          />
          {errorNumero ? (
            <FieldError id="nueva-cama-numero-error">{errorNumero}</FieldError>
          ) : (
            <FieldDescription id="nueva-cama-numero-ayuda">
              Número entero mayor a 0, único dentro del sector.
            </FieldDescription>
          )}
        </Field>

        <FieldSet>
          <FieldLegend variant="label">
            Sector <span className="text-destructive" aria-hidden="true">*</span>
          </FieldLegend>
          <SectorSelector
            value={sector}
            onChange={(s) => {
              setSector(s)
              limpiarErroresServidor()
            }}
          />
        </FieldSet>

        {errorServidorGeneral && <FieldError>{errorServidorGeneral}</FieldError>}
      </FieldGroup>

      {acciones?.({ enviando })}
    </form>
  )
}
