import { SearchIcon, XIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

interface BuscadorCatalogoProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Nombre accesible del campo, ej. "Buscar obra social por nombre". */
  label: string
  className?: string
}

/** Campo de búsqueda por nombre, con botón para limpiar (Esc también limpia). */
export function BuscadorCatalogo({ value, onChange, placeholder, label, className }: BuscadorCatalogoProps) {
  return (
    <InputGroup className={cn('h-14 rounded-xl bg-card', className)}>
      <InputGroupAddon>
        <SearchIcon className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        className="text-base [&::-webkit-search-cancel-button]:hidden"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) onChange('')
        }}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Limpiar búsqueda" onClick={() => onChange('')}>
            <XIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
