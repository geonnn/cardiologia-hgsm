import { hoyIso } from '@/lib/fechas'
import type { ContactoInput } from './api/pacientesApi'

// Constantes alineadas 1:1 con CardiologiaHGSM.Domain (Paciente, Dni, Contacto, Estudio, MedicoDeCabecera).
export const MAX_LONGITUD_NOMBRE = 50
export const MAX_LONGITUD_APELLIDO = 50
export const MIN_LONGITUD_DNI = 7
export const MAX_LONGITUD_DNI = 9
export const MAX_CONTACTOS = 5
export const MAX_LONGITUD_TELEFONO = 15
export const MAX_LONGITUD_PARENTESCO = 15
export const MAX_LONGITUD_MEDICO = 100
export const MAX_LONGITUD_TITULO_ESTUDIO = 100

const REGEX_DNI = /^[A-Za-z0-9]{7,9}$/
const REGEX_SOLO_DIGITOS = /^\d+$/

export interface ErroresPaciente {
  nombre?: string
  apellido?: string
  dni?: string
  fechaNacimiento?: string
  medicoDeCabecera?: string
}

export interface ErroresContacto {
  nombre?: string
  apellido?: string
  telefono?: string
  parentesco?: string
}

export interface ErroresEstudio {
  tipoEstudioId?: string
  titulo?: string
  fecha?: string
  descripcion?: string
}

/** Valida los datos personales y el médico de cabecera de un paciente (RF-24 / RF-25). */
export function validarDatosPaciente(datos: {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  medicoDeCabecera: string
}): ErroresPaciente {
  const errores: ErroresPaciente = {}
  const hoy = hoyIso()

  const nombre = datos.nombre.trim()
  if (!nombre) errores.nombre = 'El nombre es obligatorio.'
  else if (nombre.length > MAX_LONGITUD_NOMBRE) {
    errores.nombre = `Máximo ${MAX_LONGITUD_NOMBRE} caracteres.`
  }

  const apellido = datos.apellido.trim()
  if (!apellido) errores.apellido = 'El apellido es obligatorio.'
  else if (apellido.length > MAX_LONGITUD_APELLIDO) {
    errores.apellido = `Máximo ${MAX_LONGITUD_APELLIDO} caracteres.`
  }

  const dni = datos.dni.trim()
  if (!dni) errores.dni = 'El DNI es obligatorio.'
  else if (!REGEX_DNI.test(dni)) {
    errores.dni = `Debe tener entre ${MIN_LONGITUD_DNI} y ${MAX_LONGITUD_DNI} caracteres alfanuméricos.`
  }

  if (!datos.fechaNacimiento) errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
  else if (datos.fechaNacimiento > hoy) {
    errores.fechaNacimiento = 'No puede ser posterior a la fecha actual.'
  }

  if (datos.medicoDeCabecera.trim().length > MAX_LONGITUD_MEDICO) {
    errores.medicoDeCabecera = `Máximo ${MAX_LONGITUD_MEDICO} caracteres.`
  }

  return errores
}

/** Valida un contacto familiar/de emergencia (RF-24 / RF-25). */
export function validarContacto(contacto: ContactoInput): ErroresContacto {
  const errores: ErroresContacto = {}

  const nombre = contacto.nombre.trim()
  if (!nombre) errores.nombre = 'El nombre del contacto es obligatorio.'
  else if (nombre.length > MAX_LONGITUD_NOMBRE) {
    errores.nombre = `Máximo ${MAX_LONGITUD_NOMBRE} caracteres.`
  }

  if (contacto.apellido && contacto.apellido.trim().length > MAX_LONGITUD_APELLIDO) {
    errores.apellido = `Máximo ${MAX_LONGITUD_APELLIDO} caracteres.`
  }

  const telefono = contacto.telefono.trim()
  if (!telefono) errores.telefono = 'El teléfono es obligatorio.'
  else if (!REGEX_SOLO_DIGITOS.test(telefono)) {
    errores.telefono = 'Sólo debe contener números.'
  } else if (telefono.length > MAX_LONGITUD_TELEFONO) {
    errores.telefono = `Máximo ${MAX_LONGITUD_TELEFONO} dígitos.`
  }

  if (contacto.parentesco && contacto.parentesco.trim().length > MAX_LONGITUD_PARENTESCO) {
    errores.parentesco = `Máximo ${MAX_LONGITUD_PARENTESCO} caracteres.`
  }

  return errores
}

/** Valida los datos de un estudio complementario (RF-35). */
export function validarEstudio(datos: {
  tipoEstudioId: number | ''
  titulo: string
  fecha: string
  descripcion: string
}): ErroresEstudio {
  const errores: ErroresEstudio = {}
  const hoy = hoyIso()

  if (!datos.tipoEstudioId) {
    errores.tipoEstudioId = 'Debe seleccionar un tipo de estudio.'
  }

  const titulo = datos.titulo.trim()
  if (!titulo) errores.titulo = 'El título es obligatorio.'
  else if (titulo.length > MAX_LONGITUD_TITULO_ESTUDIO) {
    errores.titulo = `Máximo ${MAX_LONGITUD_TITULO_ESTUDIO} caracteres.`
  }

  if (!datos.fecha) errores.fecha = 'La fecha es obligatoria.'
  else if (datos.fecha > hoy) {
    errores.fecha = 'La fecha no puede ser posterior a la actual.'
  }

  if (!datos.descripcion.trim()) {
    errores.descripcion = 'La descripción o informe es obligatorio.'
  }

  return errores
}
