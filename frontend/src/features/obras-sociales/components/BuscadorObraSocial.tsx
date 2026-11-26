import { SearchIcon, XIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

interface BuscadorObraSocialProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Campo de búsqueda por nombre (RF-21.1), con botón para limpiar. */
export function BuscadorObraSocial({ value, onChange, className }: BuscadorObraSocialProps) {
  return (
    <InputGroup className={cn('h-14 rounded-xl bg-card', className)}>
      <InputGroupAddon>
        <SearchIcon className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label="Buscar obra social por nombre"
        placeholder="Buscar obra social…"
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
