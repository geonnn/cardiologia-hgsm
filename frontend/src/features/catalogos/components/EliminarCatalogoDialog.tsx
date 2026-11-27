import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { ItemCatalogo } from '../types'

interface EliminarCatalogoDialogProps {
  open: boolean
  /** Se conserva mientras el diálogo se cierra, para que el texto no cambie durante la animación. */
  item?: ItemCatalogo
  /** Por qué el backend puede rechazar la baja, ej. "No se puede eliminar una obra social asociada a una internación." */
  restriccion: string
  onOpenChange: (open: boolean) => void
  /** Elimina en la API. El diálogo se cierra al terminar, haya salido bien o no (el error lo muestra quien llama). */
  onConfirmar: (item: ItemCatalogo) => Promise<unknown>
}

/** Confirmación antes de eliminar un elemento del catálogo. */
export function EliminarCatalogoDialog({ open, item, restriccion, onOpenChange, onConfirmar }: EliminarCatalogoDialogProps) {
  const [eliminando, setEliminando] = useState(false)

  const confirmar = async () => {
    if (!item) return
    setEliminando(true)
    try {
      await onConfirmar(item)
    } finally {
      setEliminando(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(abierto) => !eliminando && onOpenChange(abierto)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-extrabold break-words text-primary">
            ¿Eliminar {item?.nombre}?
          </AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer. {restriccion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="lg" className="h-11 px-4" disabled={eliminando}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="lg"
            className="h-11 px-4"
            disabled={eliminando}
            onClick={(e) => {
              // Radix cierra el diálogo al hacer clic: se cierra recién cuando responde la API
              e.preventDefault()
              void confirmar()
            }}
          >
            {eliminando ? 'Eliminando…' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
