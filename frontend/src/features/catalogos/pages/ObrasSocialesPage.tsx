import { OBRAS_SOCIALES } from '../catalogos'
import { CatalogoPage } from './CatalogoPage'

/** RF-20 (crear), RF-21 (listar), RF-21.1 (buscar), RF-22 (modificar) y RF-23 (eliminar) obras sociales. */
export function ObrasSocialesPage() {
  return <CatalogoPage key={OBRAS_SOCIALES.recurso} config={OBRAS_SOCIALES} />
}
