import type { CatalogoConfig } from './types'

/** RF-20 a RF-23 — ObrasSocialesController (api/obras-sociales). */
export const OBRAS_SOCIALES: CatalogoConfig = {
  recurso: '/obras-sociales',
  titulo: 'Obras sociales',
  singular: 'obra social',
  plural: 'obras sociales',
  genero: 'f',
  maxLongitudNombre: 30,
  ejemploNombre: 'PAMI',
  restriccionEliminar: 'No se puede eliminar una obra social asociada a una internación.',
}

/** RF-31 a RF-34 — TiposEstudioController (api/tipos-estudio). */
export const TIPOS_ESTUDIO: CatalogoConfig = {
  recurso: '/tipos-estudio',
  titulo: 'Tipos de estudio',
  singular: 'tipo de estudio',
  plural: 'tipos de estudio',
  genero: 'm',
  maxLongitudNombre: 100,
  ejemploNombre: 'Ecocardiograma',
  restriccionEliminar: 'No se puede eliminar un tipo de estudio asociado a un estudio.',
}
