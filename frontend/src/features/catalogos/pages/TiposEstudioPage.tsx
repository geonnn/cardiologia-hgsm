import { TIPOS_ESTUDIO } from '../catalogos'
import { CatalogoPage } from './CatalogoPage'

/** RF-31 (crear), RF-32 (listar), RF-32.1 (buscar), RF-33 (modificar) y RF-34 (eliminar) tipos de estudio. */
export function TiposEstudioPage() {
  return <CatalogoPage key={TIPOS_ESTUDIO.recurso} config={TIPOS_ESTUDIO} />
}
