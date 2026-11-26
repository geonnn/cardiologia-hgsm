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
import type { ObraSocial } from '../api/obrasSocialesApi'
import { ObraSocialForm } from './ObraSocialForm'

interface ObraSocialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Obra social a modificar (RF-22). Sin ella, el modal es de alta (RF-20). */
  obraSocial?: ObraSocial
  existentes: ReadonlyArray<ObraSocial>
  /** Guarda en la API. Si rechaza, el error se muestra en el formulario y el modal sigue abierto. */
  onGuardar: (nombre: string) => Promise<unknown>
}

/** Modal de alta o modificación. Radix desmonta el contenido al cerrar, así el formulario arranca de cero cada vez. */
export function ObraSocialDialog({ open, onOpenChange, obraSocial, existentes, onGuardar }: ObraSocialDialogProps) {
  const modificando = obraSocial !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            {modificando ? 'Modificar obra social' : 'Nueva obra social'}
          </DialogTitle>
          <DialogDescription>
            {modificando ? `Cambiá el nombre de ${obraSocial.nombre}.` : 'Ingresá el nombre de la obra social.'}
          </DialogDescription>
        </DialogHeader>

        <ObraSocialForm
          nombreInicial={obraSocial?.nombre}
          excluirId={obraSocial?.id}
          existentes={existentes}
          onSubmit={onGuardar}
          acciones={({ enviando }) => (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="lg" className="h-11 px-4" disabled={enviando}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant="brand" size="lg" className="h-11 px-4" disabled={enviando}>
                {enviando ? 'Guardando…' : modificando ? 'Guardar cambios' : 'Crear obra social'}
              </Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}
