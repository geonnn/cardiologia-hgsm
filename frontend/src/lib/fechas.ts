const REGEX_SOLO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/
const MS_POR_DIA = 86_400_000

const pad = (n: number) => String(n).padStart(2, '0')

const inicioDelDia = (fecha: Date | string) => {
  if (typeof fecha === 'string') {
    const match = REGEX_SOLO_FECHA.exec(fecha)
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    }
  }
  const d = new Date(fecha)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Formatea una fecha a `dd/mm/aaaa`.
 * - Si recibe un DateOnly (`"YYYY-MM-DD"`), evita el desplazamiento UTC (-1 día).
 * - Si recibe un instante ISO (`DateTimeOffset`) o `Date`, formatea en la zona horaria del navegador.
 */
export const formatearFecha = (fecha: Date | string): string => {
  if (typeof fecha === 'string') {
    const match = REGEX_SOLO_FECHA.exec(fecha)
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`
    }
  }
  const d = new Date(fecha)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** Formatea un instante ISO (`DateTimeOffset`) o `Date` a `dd/mm/aaaa HH:mm` en hora local del navegador. */
export const formatearFechaHora = (fecha: Date | string): string => {
  const d = new Date(fecha)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Fecha actual local en formato `YYYY-MM-DD` (para `<input type="date">`). */
export const hoyIso = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Fecha y hora actual local en formato `YYYY-MM-DDTHH:mm` (para `<input type="datetime-local">`). */
export const ahoraInputLocal = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Convierte el valor de un `<input type="datetime-local">` (`"YYYY-MM-DDTHH:mm"`)
 * a ISO 8601 UTC (`"...Z"`) listo para enviar a campos `DateTimeOffset` de la API.
 */
export const inputLocalAIsoUtc = (valor: string): string => new Date(valor).toISOString()

/** Días completos transcurridos desde `fecha` hasta hoy. */
export const diasDesde = (fecha: Date | string) =>
  Math.round((inicioDelDia(new Date()).getTime() - inicioDelDia(fecha).getTime()) / MS_POR_DIA)

/** Fecha ISO de hace `dias` días (útil para datos de prueba). */
export const haceDias = (dias: number) => {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}
