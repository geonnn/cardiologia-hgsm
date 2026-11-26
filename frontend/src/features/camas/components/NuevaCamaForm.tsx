import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Cama, NuevaCama, Sector } from '../types'
import { tieneErrores, validarNuevaCama } from '../validaciones'
import { SectorSelector } from './SectorSelector'

interface NuevaCamaFormProps {
  id?: string
  /** Sector preseleccionado (por defecto, el que se está viendo). */
  sectorInicial: Sector
  /** Para validar que el número no se repita dentro del sector. */
  camasExistentes: ReadonlyArray<Cama>
  onSubmit: (cama: NuevaCama) => void
  /** Botones (se renderizan dentro del <form>, ej. un DialogFooter). */
  children?: ReactNode
}

/** Formulario de alta de cama (RF-10). */
export function NuevaCamaForm({ id, sectorInicial, camasExistentes, onSubmit, children }: NuevaCamaFormProps) {
  const [numero, setNumero] = useState('')
  const [sector, setSector] = useState(sectorInicial)
  // Los errores se muestran recién después del primer intento de envío, y luego se actualizan en vivo.
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const numeroRef = useRef<HTMLInputElement>(null)

  const errores = intentoEnviar ? validarNuevaCama({ numero, sector }, camasExistentes) : {}

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIntentoEnviar(true)
    if (tieneErrores(validarNuevaCama({ numero, sector }, camasExistentes))) {
      numeroRef.current?.focus()
      return
    }
    onSubmit({ numero: Number(numero.trim()), sector })
  }

  return (
    <form id={id} noValidate onSubmit={enviar} className="grid gap-6">
      <FieldGroup>
        <Field data-invalid={errores.numero ? true : undefined}>
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
            onChange={(e) => setNumero(e.target.value)}
            aria-invalid={errores.numero ? true : undefined}
            aria-describedby={errores.numero ? 'nueva-cama-numero-error' : 'nueva-cama-numero-ayuda'}
          />
          {errores.numero ? (
            <FieldError id="nueva-cama-numero-error">{errores.numero}</FieldError>
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
          <SectorSelector value={sector} onChange={setSector} />
        </FieldSet>
      </FieldGroup>

      {children}
    </form>
  )
}
