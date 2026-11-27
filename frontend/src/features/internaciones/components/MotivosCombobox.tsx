import { useEffect, useId, useRef, useState } from 'react'
import { PlusIcon, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { MotivoInternacionDto } from '../api/internacionesApi'

interface MotivosComboboxProps {
  label?: string
  placeholder?: string
  required?: boolean
  options: ReadonlyArray<MotivoInternacionDto>
  selectedIds: number[]
  error?: string
  onChange: (ids: number[]) => void
}

/** Selector múltiple buscable para Motivos de Internación (RF-47 / RF-49). */
export function MotivosCombobox({
  label = 'Motivos de internación',
  placeholder = 'Buscar y seleccionar motivos…',
  required = true,
  options,
  selectedIds,
  error,
  onChange,
}: MotivosComboboxProps) {
  const inputId = useId()
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alClickFuera = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', alClickFuera)
    return () => document.removeEventListener('mousedown', alClickFuera)
  }, [])

  const seleccionadas = options.filter((opt) => selectedIds.includes(opt.id))
  const disponibles = options.filter(
    (opt) =>
      !selectedIds.includes(opt.id) &&
      opt.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )

  return (
    <Field
      ref={containerRef}
      data-invalid={error ? true : undefined}
      className="relative gap-2"
    >
      <FieldLabel htmlFor={inputId}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>

      {seleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {seleccionadas.map((opt) => (
            <Badge
              key={opt.id}
              variant="secondary"
              className="h-7 gap-1 border border-primary/20 bg-primary/10 px-2.5 text-xs font-semibold text-primary"
            >
              <span>{opt.nombre}</span>
              <button
                type="button"
                onClick={() => onChange(selectedIds.filter((item) => item !== opt.id))}
                title={`Quitar ${opt.nombre}`}
                aria-label={`Quitar ${opt.nombre}`}
                className="rounded-full p-0.5 hover:bg-primary/15"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          id={inputId}
          type="text"
          autoComplete="off"
          placeholder={seleccionadas.length === 0 ? placeholder : 'Buscar más motivos…'}
          value={busqueda}
          onFocus={() => setAbierto(true)}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setAbierto(true)
          }}
          aria-invalid={error ? true : undefined}
          className="h-10 bg-card"
        />

        {abierto && (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute inset-x-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md"
          >
            {disponibles.length > 0 ? (
              disponibles.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-primary"
                    onClick={() => {
                      onChange([...selectedIds, opt.id])
                      setBusqueda('')
                      setAbierto(false)
                    }}
                  >
                    <span>{opt.nombre}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <PlusIcon className="size-3" />
                      Agregar
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-center text-xs text-muted-foreground">
                {options.length > 0 && options.length === selectedIds.length
                  ? 'Todos los motivos han sido seleccionados'
                  : 'No se encontraron coincidencias'}
              </li>
            )}
          </ul>
        )}
      </div>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
