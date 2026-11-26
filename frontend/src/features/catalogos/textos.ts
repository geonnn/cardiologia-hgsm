import type { CatalogoConfig } from './types'

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** Textos de la interfaz concordados en género con el catálogo. */
export function textosCatalogo({ singular, plural, genero }: CatalogoConfig) {
  const f = genero === 'f'
  const o = f ? 'a' : 'o'
  const un = f ? 'una' : 'un'

  return {
    /** "Nueva obra social" / "Nuevo tipo de estudio" */
    nuevo: `${f ? 'Nueva' : 'Nuevo'} ${singular}`,
    /** "Modificar obra social" */
    modificar: `Modificar ${singular}`,
    /** "Crear obra social" */
    crear: `Crear ${singular}`,
    buscar: `Buscar ${singular}…`,
    buscarPorNombre: `Buscar ${singular} por nombre`,
    cargando: `Cargando ${plural}…`,
    errorCarga: `No se pudieron cargar ${f ? 'las' : 'los'} ${plural}`,
    vacio: `No hay ${plural} cargad${o}s.`,
    sinCoincidencias: (busqueda: string) => `No hay ${plural} que coincidan con “${busqueda}”.`,
    total: (cantidad: number) => `${cantidad} ${plural}`,
    totalFiltrado: (visibles: number, total: number) => `${visibles} de ${total} ${plural}`,
    duplicado: `Ya existe ${un} ${singular} con ese nombre.`,
    nombreRequerido: `Ingresá el nombre de${f ? ' la ' : 'l '}${singular}.`,
    /** Toasts: "Obra social PAMI creada" */
    creado: (nombre: string) => `${capitalizar(singular)} ${nombre} cread${o}`,
    modificado: (nombre: string) => `${capitalizar(singular)} ${nombre} modificad${o}`,
    eliminado: (nombre: string) => `${capitalizar(singular)} ${nombre} eliminad${o}`,
  }
}
