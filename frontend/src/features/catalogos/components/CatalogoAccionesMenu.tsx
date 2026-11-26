import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ItemCatalogo } from '../types'

interface CatalogoAccionesMenuProps {
  item: ItemCatalogo
  onModificar: (item: ItemCatalogo) => void
  onEliminar: (item: ItemCatalogo) => void
}

/** Botón ⋮ con las acciones de un elemento del catálogo (modificar y eliminar). */
export function CatalogoAccionesMenu({ item, onModificar, onEliminar }: CatalogoAccionesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Acciones de ${item.nombre}`}
          className="size-11 flex-none rounded-full text-muted-foreground"
        >
          <EllipsisVerticalIcon className="size-[22px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-80 min-w-56">
        <DropdownMenuLabel className="truncate">{item.nombre}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="min-h-11 font-semibold" onSelect={() => onModificar(item)}>
            <PencilIcon />
            Modificar
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" className="min-h-11 font-semibold" onSelect={() => onEliminar(item)}>
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
