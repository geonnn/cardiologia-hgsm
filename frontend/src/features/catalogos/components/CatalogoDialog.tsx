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
import { textosCatalogo } from '../textos'
import type { CatalogoConfig, ItemCatalogo } from '../types'
import { CatalogoForm } from './CatalogoForm'

interface CatalogoDialogProps {
  config: CatalogoConfig
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Elemento a modificar. Sin él, el modal es de alta. */
  item?: ItemCatalogo
  existentes: ReadonlyArray<ItemCatalogo>
  /** Guarda en la API. Si rechaza, el error se muestra en el formulario y el modal sigue abierto. */
  onGuardar: (nombre: string) => Promise<unknown>
}

/** Modal de alta o modificación. Radix desmonta el contenido al cerrar, así el formulario arranca de cero cada vez. */
export function CatalogoDialog({ config, open, onOpenChange, item, existentes, onGuardar }: CatalogoDialogProps) {
  const textos = textosCatalogo(config)
  const modificando = item !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-primary">
            {modificando ? textos.modificar : textos.nuevo}
          </DialogTitle>
          <DialogDescription className="break-words">
            {modificando ? `Cambiá el nombre de ${item.nombre}.` : textos.nombreRequerido}
          </DialogDescription>
        </DialogHeader>

        <CatalogoForm
          config={config}
          nombreInicial={item?.nombre}
          excluirId={item?.id}
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
                {enviando ? 'Guardando…' : modificando ? 'Guardar cambios' : textos.crear}
              </Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}
