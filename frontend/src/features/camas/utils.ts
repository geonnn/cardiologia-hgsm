import { diasDesde } from '@/lib/fechas'
import { ESTADOS } from './constants'
import type { Cama, FiltroEstado, Sexo } from './types'

export const textoDiasInternacion = (fechaIngreso: string) => {
  const dias = diasDesde(fechaIngreso)
  if (dias <= 0) return 'ingresó hoy'
  return dias === 1 ? '1 día' : `${dias} días`
}

export const abreviarSexo = (sexo: Sexo) => (sexo === 'Femenino' ? 'F' : 'M')

export const contarPorEstado = (camas: ReadonlyArray<Cama>): Record<FiltroEstado, number> => {
  const conteo: Record<FiltroEstado, number> = { todos: camas.length, ocupada: 0, disponible: 0, aislamiento: 0, deshabilitada: 0 }
  for (const cama of camas) conteo[cama.estado]++
  return conteo
}

/** Ordena por estado (según ESTADOS) y luego por número de cama. */
export const ordenarCamas = (a: Cama, b: Cama) =>
  ESTADOS.indexOf(a.estado) - ESTADOS.indexOf(b.estado) || a.numero - b.numero
