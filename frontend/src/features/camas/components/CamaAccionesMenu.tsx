import { EllipsisVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ACCIONES_POR_ESTADO } from '../constants'
import type { AccionCama, Cama } from '../types'

interface CamaAccionesMenuProps {
  cama: Cama
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccion: (cama: Cama, accion: AccionCama) => void
  triggerClassName?: string
}

/** Botón ⋮ con las acciones válidas para el estado actual de la cama. */
export function CamaAccionesMenu({ cama, open, onOpenChange, onAccion, triggerClassName }: CamaAccionesMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Acciones de la cama ${cama.numero} de ${cama.sector}`}
          className={cn('size-11 rounded-full text-inherit hover:bg-black/10 hover:text-inherit', triggerClassName)}
        >
          <EllipsisVerticalIcon className="size-[22px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuLabel>
          Cama {cama.numero} · {cama.sector}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {ACCIONES_POR_ESTADO[cama.estado].map((accion) => (
            <DropdownMenuItem
              key={accion.id}
              variant={accion.tone === 'danger' ? 'destructive' : 'default'}
              className="min-h-11 font-semibold"
              onSelect={() => onAccion(cama, accion)}
            >
              {accion.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
