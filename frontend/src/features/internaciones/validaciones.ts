import { ahoraInputLocal } from '@/lib/fechas'
import type { CondicionAlta } from './api/internacionesApi'
import {
  MAX_LONGITUD_AISLAMIENTO,
  MAX_LONGITUD_TITULO_PENDIENTE,
  MAX_MESES_DESFASAJE_TRATAMIENTO,
} from './constants'

export interface ErroresNuevaInternacion {
  pacienteId?: string
  camaId?: string
  fechaInternacion?: string
  motivoInternacionIds?: string
  enfermedadActual?: string
  aislamiento?: string
  camaAislamientoId?: string
}

export interface ErroresModificarInternacion {
  camaId?: string
  fechaInternacion?: string
  motivoInternacionIds?: string
  enfermedadActual?: string
  aislamiento?: string
  camaAislamientoId?: string
}

export interface ErroresRegistrarAlta {
  condicionAlta?: string
  fechaFin?: string
}

export interface ErroresNuevoPendiente {
  titulo?: string
  descripcion?: string
}

export interface ErroresNuevaEvolucion {
  fecha?: string
  detalle?: string
}

export interface ErroresTratamiento {
  descripcion?: string
  fecha?: string
}

/** Validación cliente para alta de internación (HU-19 / RF-47). */
export function validarNuevaInternacion(datos: {
  pacienteId: string
  camaId: string
  fechaInternacion: string
  motivoInternacionIds: number[]
  enfermedadActual: string
  aislamiento: string
  camaAislamientoId: string
}): ErroresNuevaInternacion {
  const errores: ErroresNuevaInternacion = {}
  const ahora = ahoraInputLocal()

  if (!datos.pacienteId) {
    errores.pacienteId = 'Debe seleccionar un paciente.'
  }

  if (!datos.camaId) {
    errores.camaId = 'Debe seleccionar una cama disponible.'
  }

  if (datos.fechaInternacion && datos.fechaInternacion > ahora) {
    errores.fechaInternacion = 'La fecha de ingreso no puede ser posterior a la fecha actual.'
  }

  if (datos.motivoInternacionIds.length === 0) {
    errores.motivoInternacionIds = 'Debe seleccionar al menos un motivo de internación.'
  }

  if (!datos.enfermedadActual.trim()) {
    errores.enfermedadActual = 'La enfermedad actual es obligatoria.'
  }

  if (datos.aislamiento.trim().length > MAX_LONGITUD_AISLAMIENTO) {
    errores.aislamiento = `Máximo ${MAX_LONGITUD_AISLAMIENTO} caracteres.`
  }

  if (datos.camaAislamientoId && datos.camaId && datos.camaAislamientoId === datos.camaId) {
    errores.camaAislamientoId = 'No puede coincidir con la cama asignada al paciente.'
  }

  return errores
}

/** Validación cliente para modificación de internación activa y pase/swap (HU-20 / RF-49). */
export function validarModificarInternacion(datos: {
  camaId: string
  fechaInternacion: string
  motivoInternacionIds: number[]
  enfermedadActual: string
  aislamiento: string
  camaAislamientoId: string
}): ErroresModificarInternacion {
  const errores: ErroresModificarInternacion = {}
  const ahora = ahoraInputLocal()

  if (!datos.camaId) {
    errores.camaId = 'Debe seleccionar una cama.'
  }

  if (!datos.fechaInternacion) {
    errores.fechaInternacion = 'La fecha de ingreso es obligatoria.'
  } else if (datos.fechaInternacion > ahora) {
    errores.fechaInternacion = 'La fecha de ingreso no puede ser posterior a la fecha actual.'
  }

  if (datos.motivoInternacionIds.length === 0) {
    errores.motivoInternacionIds = 'Debe seleccionar al menos un motivo de internación.'
  }

  if (!datos.enfermedadActual.trim()) {
    errores.enfermedadActual = 'La enfermedad actual es obligatoria.'
  }

  if (datos.aislamiento.trim().length > MAX_LONGITUD_AISLAMIENTO) {
    errores.aislamiento = `Máximo ${MAX_LONGITUD_AISLAMIENTO} caracteres.`
  }

  if (datos.camaAislamientoId && datos.camaId && datos.camaAislamientoId === datos.camaId) {
    errores.camaAislamientoId = 'No puede coincidir con la cama asignada al paciente.'
  }

  return errores
}

/** Validación cliente para registro de fin de internación / alta (HU-22 / RF-50). */
export function validarRegistrarAlta(datos: {
  condicionAlta: CondicionAlta | ''
  fechaFin: string
  fechaIngresoIso?: string
}): ErroresRegistrarAlta {
  const errores: ErroresRegistrarAlta = {}
  const ahora = ahoraInputLocal()

  if (!datos.condicionAlta) {
    errores.condicionAlta = 'Debe seleccionar una condición de alta.'
  }

  if (!datos.fechaFin) {
    errores.fechaFin = 'La fecha de egreso es obligatoria.'
  } else if (datos.fechaFin > ahora) {
    errores.fechaFin = 'La fecha de egreso no puede ser posterior a la fecha actual.'
  } else if (
    datos.fechaIngresoIso &&
    new Date(datos.fechaFin).getTime() < new Date(datos.fechaIngresoIso).getTime()
  ) {
    errores.fechaFin = 'La fecha de egreso no puede ser anterior a la fecha de ingreso.'
  }

  return errores
}

/** Validación cliente para alta de pendiente asistencial (HU-32 / RF-44). */
export function validarNuevoPendiente(datos: {
  titulo: string
  descripcion: string
}): ErroresNuevoPendiente {
  const errores: ErroresNuevoPendiente = {}
  const titulo = datos.titulo.trim()

  if (!titulo) {
    errores.titulo = 'El título es obligatorio.'
  } else if (titulo.length > MAX_LONGITUD_TITULO_PENDIENTE) {
    errores.titulo = `El título no puede superar los ${MAX_LONGITUD_TITULO_PENDIENTE} caracteres.`
  }

  if (!datos.descripcion.trim()) {
    errores.descripcion = 'La descripción es obligatoria.'
  }

  return errores
}

/** Validación cliente para alta de nota de evolución médica (HU-23 / RF-38). */
export function validarNuevaEvolucion(datos: {
  fecha: string
  detalle: string
}): ErroresNuevaEvolucion {
  const errores: ErroresNuevaEvolucion = {}
  const ahora = ahoraInputLocal()

  if (!datos.fecha) {
    errores.fecha = 'La fecha y hora de evolución es obligatoria.'
  } else if (datos.fecha > ahora) {
    errores.fecha = 'La fecha de evolución no puede ser posterior a la fecha actual.'
  }

  if (!datos.detalle.trim()) {
    errores.detalle = 'El detalle de la evolución es obligatorio.'
  }

  return errores
}

const sumarMeses = (base: Date, meses: number) => {
  const destino = new Date(base.getTime())
  const diaOriginal = destino.getDate()
  destino.setDate(1)
  destino.setMonth(destino.getMonth() + meses)
  const ultimoDiaMes = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate()
  destino.setDate(Math.min(diaOriginal, ultimoDiaMes))
  return destino
}

/** Validación cliente para alta y modificación de tratamientos (HU-25 / RF-40 y HU-27 / RF-42). */
export function validarTratamiento(datos: {
  descripcion: string
  fecha: string
  validarFecha?: boolean
}): ErroresTratamiento {
  const errores: ErroresTratamiento = {}

  if (!datos.descripcion.trim()) {
    errores.descripcion = 'La descripción del tratamiento es obligatoria.'
  }

  if (datos.validarFecha !== false && datos.fecha) {
    const fecha = new Date(datos.fecha)
    const ahora = new Date()
    const limiteInferior = sumarMeses(ahora, -MAX_MESES_DESFASAJE_TRATAMIENTO)
    const limiteSuperior = sumarMeses(ahora, MAX_MESES_DESFASAJE_TRATAMIENTO)

    if (
      Number.isNaN(fecha.getTime()) ||
      fecha.getTime() < limiteInferior.getTime() ||
      fecha.getTime() > limiteSuperior.getTime()
    ) {
      errores.fecha = `La fecha del tratamiento no puede diferir en más de ${MAX_MESES_DESFASAJE_TRATAMIENTO} meses respecto a la fecha actual.`
    }
  }

  return errores
}
