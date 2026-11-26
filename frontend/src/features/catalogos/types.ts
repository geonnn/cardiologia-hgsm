/**
 * Elemento de un catálogo del backend: ObraSocialDto, TipoEstudioDto, MotivoInternacionDto, etc.
 * Todos tienen la misma forma y los mismos endpoints (CatalogoService<TEntity, int>).
 */
export interface ItemCatalogo {
  id: number
  nombre: string
}

/** Describe un catálogo: a qué endpoint va y cómo se nombra en la interfaz. */
export interface CatalogoConfig {
  /** Ruta del controller sin `/api`, ej. '/obras-sociales' (GET, POST, PUT {id}, DELETE {id}). */
  recurso: string
  /** Título de la página, ej. 'Obras sociales'. */
  titulo: string
  /** En minúscula, ej. 'obra social'. */
  singular: string
  /** En minúscula, ej. 'obras sociales'. */
  plural: string
  /** Género gramatical, para concordar los textos ("Nueva obra social" / "Nuevo tipo de estudio"). */
  genero: 'f' | 'm'
  /** Igual que `MaxLongitudNombre` de la entidad en el dominio. */
  maxLongitudNombre: number
  /** Ejemplo para el campo nombre, ej. 'PAMI'. */
  ejemploNombre: string
  /** Por qué el backend puede rechazar la baja (409 Catalogo.EnUso). Se muestra al confirmar. */
  restriccionEliminar: string
}
