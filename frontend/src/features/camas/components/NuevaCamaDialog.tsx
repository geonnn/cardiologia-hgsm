import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Cama, NuevaCama, Sector } from '../types'
import { NuevaCamaForm } from './NuevaCamaForm'

interface NuevaCamaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectorInicial: Sector
  camasExistentes: ReadonlyArray<Cama>
  /** Crea la cama en la API. Si rechaza, el error se muestra en el formulario y el modal sigue abierto. */
  onCrear: (cama: NuevaCama) => Promise<unknown>
}

/** Modal de alta de cama. Radix desmonta el contenido al cerrar, así el formulario arranca vacío cada vez. */
export function NuevaCamaDialog({ open, onOpenChange, sectorInicial, camasExistentes, onCrear }: NuevaCamaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">Nueva cama</DialogTitle>
          <DialogDescription>La cama se crea en estado Disponible.</DialogDescription>
        </DialogHeader>

        <NuevaCamaForm
          sectorInicial={sectorInicial}
          camasExistentes={camasExistentes}
          onSubmit={onCrear}
          acciones={({ enviando }) => (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="lg" className="h-11 px-4" disabled={enviando}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant="brand" size="lg" className="h-11 px-4" disabled={enviando}>
                {enviando ? 'Creando…' : 'Crear cama'}
              </Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}
