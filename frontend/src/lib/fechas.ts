const MS_POR_DIA = 86_400_000

const pad = (n: number) => String(n).padStart(2, '0')

const inicioDelDia = (fecha: Date | string) => {
  const d = new Date(fecha)
  d.setHours(0, 0, 0, 0)
  return d
}

/** dd/mm/aaaa */
export const formatearFecha = (fecha: Date | string) => {
  const d = new Date(fecha)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** Días completos transcurridos desde `fecha` hasta hoy. */
export const diasDesde = (fecha: Date | string) =>
  Math.round((inicioDelDia(new Date()).getTime() - inicioDelDia(fecha).getTime()) / MS_POR_DIA)

/** Fecha ISO de hace `dias` días (útil para datos de prueba). */
export const haceDias = (dias: number) => {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}
