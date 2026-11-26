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
import type { ObraSocial } from '../api/obrasSocialesApi'

interface ObraSocialAccionesMenuProps {
  obraSocial: ObraSocial
  onModificar: (obraSocial: ObraSocial) => void
  onEliminar: (obraSocial: ObraSocial) => void
}

/** Botón ⋮ con las acciones de una obra social (RF-22 / RF-23). */
export function ObraSocialAccionesMenu({ obraSocial, onModificar, onEliminar }: ObraSocialAccionesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Acciones de ${obraSocial.nombre}`}
          className="size-11 rounded-full text-muted-foreground"
        >
          <EllipsisVerticalIcon className="size-[22px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="truncate">{obraSocial.nombre}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="min-h-11 font-semibold" onSelect={() => onModificar(obraSocial)}>
            <PencilIcon />
            Modificar
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            className="min-h-11 font-semibold"
            onSelect={() => onEliminar(obraSocial)}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
