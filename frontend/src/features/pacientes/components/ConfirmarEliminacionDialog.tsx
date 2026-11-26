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

interface ConfirmarEliminacionDialogProps {
  open: boolean
  titulo: string
  descripcion: string
  onOpenChange: (open: boolean) => void
  onConfirmar: () => Promise<unknown>
}

/** Diálogo de confirmación destructiva (reemplaza `window.confirm` para contactos y estudios). */
export function ConfirmarEliminacionDialog({
  open,
  titulo,
  descripcion,
  onOpenChange,
  onConfirmar,
}: ConfirmarEliminacionDialogProps) {
  const [eliminando, setEliminando] = useState(false)

  const confirmar = async () => {
    setEliminando(true)
    try {
      await onConfirmar()
    } finally {
      setEliminando(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !eliminando && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-extrabold text-primary">
            {titulo}
          </AlertDialogTitle>
          <AlertDialogDescription>{descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="lg" className="h-10 px-4" disabled={eliminando}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="lg"
            className="h-10 px-4"
            disabled={eliminando}
            onClick={(e) => {
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
