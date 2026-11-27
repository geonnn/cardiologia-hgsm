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

/** RF-12 a RF-15 — MotivosInternacionController (api/motivos-internacion). */
export const MOTIVOS_INTERNACION: CatalogoConfig = {
  recurso: '/motivos-internacion',
  titulo: 'Motivos de internación',
  singular: 'motivo de internación',
  plural: 'motivos de internación',
  genero: 'm',
  maxLongitudNombre: 30,
  ejemploNombre: 'Insuficiencia cardíaca',
  restriccionEliminar: 'No se puede eliminar un motivo de internación asociado a una internación.',
}

/** RF-16 a RF-19 — FactoresDeRiesgoController (api/factores-de-riesgo). */
export const FACTORES_DE_RIESGO: CatalogoConfig = {
  recurso: '/factores-de-riesgo',
  titulo: 'Factores de riesgo cardiovascular',
  singular: 'factor de riesgo cardiovascular',
  plural: 'factores de riesgo cardiovascular',
  genero: 'm',
  maxLongitudNombre: 30,
  ejemploNombre: 'Hipertensión arterial',
  restriccionEliminar: 'No se puede eliminar un factor de riesgo asociado a un paciente.',
}
