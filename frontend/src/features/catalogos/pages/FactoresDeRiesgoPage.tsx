import { FACTORES_DE_RIESGO } from '../catalogos'
import { CatalogoPage } from './CatalogoPage'

/** RF-16 (crear), RF-17 (listar), RF-17.1 (buscar), RF-18 (modificar) y RF-19 (eliminar) factores de riesgo cardiovascular. */
export function FactoresDeRiesgoPage() {
  return <CatalogoPage key={FACTORES_DE_RIESGO.recurso} config={FACTORES_DE_RIESGO} />
}
