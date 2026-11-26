import { textosCatalogo } from './textos'
import type { CatalogoConfig, ItemCatalogo } from './types'

/** Normaliza como el backend para comparar nombres: sin espacios en los extremos y sin distinguir mayúsculas. */
const normalizar = (nombre: string) => nombre.trim().toLowerCase()

/**
 * Valida el nombre de un elemento del catálogo: obligatorio, con largo máximo y único.
 * Devuelve el mensaje de error o `undefined` si es válido.
 * @param excluirId id del elemento que se está modificando (no cuenta como duplicado consigo mismo).
 */
export function validarNombreCatalogo(
  config: CatalogoConfig,
  nombre: string,
  existentes: ReadonlyArray<ItemCatalogo>,
  excluirId?: number,
): string | undefined {
  const textos = textosCatalogo(config)
  const limpio = nombre.trim()
  if (!limpio) return textos.nombreRequerido
  if (limpio.length > config.maxLongitudNombre)
    return `El nombre no puede superar los ${config.maxLongitudNombre} caracteres.`
  const duplicado = existentes.some((i) => i.id !== excluirId && normalizar(i.nombre) === normalizar(limpio))
  if (duplicado) return textos.duplicado
  return undefined
}
