import { useEffect, useId, useRef, useState } from 'react'
import { XIcon } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export interface CatalogoOpcion {
  id: number
  nombre: string
}

interface CatalogoComboboxProps {
  label: string
  placeholder?: string
  options: ReadonlyArray<CatalogoOpcion>
  value: number | undefined
  onChange: (value: number | undefined) => void
}

/** Selector buscable de una opción de catálogo para paneles de filtro. */
export function CatalogoCombobox({
  label,
  placeholder = 'Buscar opción…',
  options,
  value,
  onChange,
}: CatalogoComboboxProps) {
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

  const seleccionada = options.find((opt) => opt.id === value)
  const filtradas = options.filter((opt) =>
    opt.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )

  return (
    <Field ref={containerRef} className="relative gap-1.5">
      <FieldLabel htmlFor={inputId} className="text-xs font-semibold text-primary">
        {label}
      </FieldLabel>

      {seleccionada ? (
        <div className="flex h-9 items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/8 px-3 text-sm font-medium text-primary">
          <span className="truncate">{seleccionada.nombre}</span>
          <button
            type="button"
            onClick={() => {
              onChange(undefined)
              setBusqueda('')
            }}
            title="Quitar filtro"
            aria-label={`Quitar filtro ${label}`}
            className="grid size-5 shrink-0 place-items-center rounded hover:bg-primary/15"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Input
            id={inputId}
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            value={busqueda}
            onFocus={() => setAbierto(true)}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setAbierto(true)
            }}
            className="h-9 bg-card text-sm"
          />
          {abierto && (
            <ul
              role="listbox"
              aria-label={label}
              className="absolute inset-x-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md"
            >
              {filtradas.length > 0 ? (
                filtradas.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-primary"
                      onClick={() => {
                        onChange(opt.id)
                        setBusqueda('')
                        setAbierto(false)
                      }}
                    >
                      {opt.nombre}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-center text-xs text-muted-foreground">
                  No hay coincidencias
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </Field>
  )
}
