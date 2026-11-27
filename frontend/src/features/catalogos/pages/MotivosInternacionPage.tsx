import { MOTIVOS_INTERNACION } from '../catalogos'
import { CatalogoPage } from './CatalogoPage'

/** RF-12 (crear), RF-13 (listar), RF-13.1 (buscar), RF-14 (modificar) y RF-15 (eliminar) motivos de internación. */
export function MotivosInternacionPage() {
  return <CatalogoPage key={MOTIVOS_INTERNACION.recurso} config={MOTIVOS_INTERNACION} />
}
