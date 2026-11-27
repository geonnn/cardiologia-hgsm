import type { Cama, Sector } from './types'

export interface NuevaCamaValores {
  /** Texto tal como lo escribió el usuario. */
  numero: string
  sector: Sector
}

export type NuevaCamaErrores = Partial<Record<keyof NuevaCamaValores, string>>

/**
 * Reglas de RF-10:
 * - Número de cama: entero, mayor a 0.
 * - Único entre camas de un mismo sector.
 */
export function validarNuevaCama(valores: NuevaCamaValores, camasExistentes: ReadonlyArray<Cama>): NuevaCamaErrores {
  const texto = valores.numero.trim()

  if (!texto) return { numero: 'Ingresá el número de cama.' }

  const numero = Number(texto)
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero <= 0) {
    return { numero: 'El número de cama debe ser un número entero mayor a 0.' }
  }

  if (camasExistentes.some((c) => c.sector === valores.sector && c.numero === numero)) {
    return { numero: `Ya existe la cama ${numero} en ${valores.sector}.` }
  }

  return {}
}

export const tieneErrores = (errores: NuevaCamaErrores) => Object.values(errores).some(Boolean)
