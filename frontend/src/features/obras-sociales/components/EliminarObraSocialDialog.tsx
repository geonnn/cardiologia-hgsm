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
import type { ObraSocial } from '../api/obrasSocialesApi'

interface EliminarObraSocialDialogProps {
  open: boolean
  /** Se conserva mientras el diálogo se cierra, para que el texto no cambie durante la animación. */
  obraSocial?: ObraSocial
  onOpenChange: (open: boolean) => void
  /** Elimina en la API. Resuelve si se pudo; el diálogo se cierra en ambos casos (el error lo muestra quien llama). */
  onConfirmar: (obraSocial: ObraSocial) => Promise<unknown>
}

/** Confirmación antes de eliminar (RF-23). */
export function EliminarObraSocialDialog({ open, obraSocial, onOpenChange, onConfirmar }: EliminarObraSocialDialogProps) {
  const [eliminando, setEliminando] = useState(false)

  const confirmar = async () => {
    if (!obraSocial) return
    setEliminando(true)
    try {
      await onConfirmar(obraSocial)
    } finally {
      setEliminando(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !eliminando && onOpenChange(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-extrabold text-primary">
            ¿Eliminar {obraSocial?.nombre}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. No se puede eliminar una obra social asociada a una internación.
          </AlertDialogDescription>
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
