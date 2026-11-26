import type { ObraSocial } from './api/obrasSocialesApi'

/** Igual que `ObraSocial.MaxLongitudNombre` en el dominio (RF-20 / RF-22). */
export const MAX_LONGITUD_NOMBRE = 30

/** Normaliza como el backend para comparar nombres: sin espacios en los extremos y sin distinguir mayúsculas. */
const normalizar = (nombre: string) => nombre.trim().toLowerCase()

/**
 * Valida el nombre de una obra social. Devuelve el mensaje de error o `undefined` si es válido.
 * @param excluirId id de la obra social que se está modificando (no cuenta como duplicada consigo misma).
 */
export function validarNombreObraSocial(
  nombre: string,
  existentes: ReadonlyArray<ObraSocial>,
  excluirId?: number,
): string | undefined {
  const limpio = nombre.trim()
  if (!limpio) return 'Ingresá el nombre de la obra social.'
  if (limpio.length > MAX_LONGITUD_NOMBRE) return `El nombre no puede superar los ${MAX_LONGITUD_NOMBRE} caracteres.`
  const duplicada = existentes.some((o) => o.id !== excluirId && normalizar(o.nombre) === normalizar(limpio))
  if (duplicada) return 'Ya existe una obra social con ese nombre.'
  return undefined
}
