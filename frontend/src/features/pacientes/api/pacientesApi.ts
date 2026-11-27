// Acceso a PacientesController (api/pacientes) y sus subrecursos (contactos, factores y estudios).
import type { AxiosRequestConfig } from 'axios'
import type {
  AgregarContactoRequest,
  ContactoDto,
  CrearEstudioRequest,
  CrearPacienteRequest,
  EstudioDto,
  ModificarContactoRequest,
  ModificarPacienteRequest,
  PacienteDetalleDto,
  PacienteOrden,
  PacienteResumenDto,
  ReemplazarFactoresDeRiesgoRequest,
  Sexo,
} from '@/api/types'
import { api } from '@/lib/api'

export type { PacienteOrden, Sexo }
export type Contacto = ContactoDto
export type Estudio = EstudioDto
export type PacienteResumen = PacienteResumenDto
export type PacienteDetalle = PacienteDetalleDto

export interface PaginatedList<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ContactoInput {
  nombre: string
  telefono: string
  apellido?: string | null
  parentesco?: string | null
}

export interface CrearPacientePayload {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string // "YYYY-MM-DD"
  sexo: Sexo
  antecedentes?: string | null
  medicoDeCabeceraId?: string | null
  factorDeRiesgoIds?: number[]
  contactos?: ContactoInput[]
}

export interface ModificarPacientePayload {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string // "YYYY-MM-DD"
  sexo: Sexo
  antecedentes?: string | null
  medicoDeCabeceraId?: string | null
}

export interface CrearEstudioPayload {
  tipoEstudioId: number
  titulo: string
  fecha: string // "YYYY-MM-DD" (DateOnly)
  descripcion: string
}

export interface FiltrosPacientes {
  page?: number
  pageSize?: number
  busqueda?: string
  sexo?: Sexo
  factorDeRiesgoId?: number
  motivoInternacionId?: number
  conInternacionActiva?: boolean
  medicoDeCabeceraId?: string
  fechaCargaDesde?: string
  fechaCargaHasta?: string
  ordenarPor?: PacienteOrden
  descendente?: boolean
}

const BASE_PATH = '/pacientes'

// ---- Builders para useApiQuery ----

/** RF-26 / 26.1 / 26.2 / 26.3 — GET api/pacientes */
export const listarPacientesRequest = (params: FiltrosPacientes = {}): AxiosRequestConfig => ({
  method: 'get',
  url: BASE_PATH,
  params: {
    page: params.page,
    pageSize: params.pageSize,
    busqueda: params.busqueda?.trim() || undefined,
    sexo: params.sexo || undefined,
    factorDeRiesgoId: params.factorDeRiesgoId,
    motivoInternacionId: params.motivoInternacionId,
    conInternacionActiva: params.conInternacionActiva,
    medicoDeCabeceraId: params.medicoDeCabeceraId || undefined,
    fechaCargaDesde: params.fechaCargaDesde || undefined,
    fechaCargaHasta: params.fechaCargaHasta || undefined,
    ordenarPor: params.ordenarPor,
    descendente: params.descendente,
  },
})

/** GET api/pacientes/{id} */
export const obtenerPacienteRequest = (id: string): AxiosRequestConfig => ({
  method: 'get',
  url: `${BASE_PATH}/${id}`,
})

/** RF-37 — GET api/pacientes/{id}/estudios */
export const listarEstudiosRequest = (
  pacienteId: string,
  params: {
    page?: number
    pageSize?: number
    tipoEstudioId?: number
    fechaDesde?: string
    fechaHasta?: string
  } = {},
): AxiosRequestConfig => ({
  method: 'get',
  url: `${BASE_PATH}/${pacienteId}/estudios`,
  params: {
    page: params.page,
    pageSize: params.pageSize,
    tipoEstudioId: params.tipoEstudioId,
    fechaDesde: params.fechaDesde || undefined,
    fechaHasta: params.fechaHasta || undefined,
  },
})

// ---- Mutaciones ----

/** RF-24 — POST api/pacientes (atómico con contactos y factores de riesgo). */
export async function crearPaciente(payload: CrearPacientePayload): Promise<string> {
  const body: CrearPacienteRequest = {
    nombre: payload.nombre,
    apellido: payload.apellido,
    dni: payload.dni,
    fechaNacimiento: payload.fechaNacimiento,
    sexo: payload.sexo,
    antecedentes: payload.antecedentes || null,
    medicoDeCabeceraId: payload.medicoDeCabeceraId || null,
    factorDeRiesgoIds:
      payload.factorDeRiesgoIds && payload.factorDeRiesgoIds.length > 0
        ? payload.factorDeRiesgoIds
        : null,
    contactos:
      payload.contactos && payload.contactos.length > 0
        ? payload.contactos.map((c) => ({
            nombre: c.nombre,
            telefono: c.telefono,
            apellido: c.apellido || null,
            parentesco: c.parentesco || null,
          }))
        : null,
  }

  const { data } = await api.post<{ id: string }>(BASE_PATH, body)
  return data.id
}

/** RF-25 — PUT api/pacientes/{id} */
export async function modificarPaciente(
  id: string,
  payload: ModificarPacientePayload,
): Promise<void> {
  const body: ModificarPacienteRequest = {
    nombre: payload.nombre,
    apellido: payload.apellido,
    dni: payload.dni,
    fechaNacimiento: payload.fechaNacimiento,
    sexo: payload.sexo,
    antecedentes: payload.antecedentes || null,
    medicoDeCabeceraId: payload.medicoDeCabeceraId || null,
  }

  await api.put(`${BASE_PATH}/${id}`, body)
}

/** RF-25 — PUT api/pacientes/{id}/factores-de-riesgo */
export async function reemplazarFactoresDeRiesgo(
  pacienteId: string,
  factorDeRiesgoIds: number[],
): Promise<void> {
  const body: ReemplazarFactoresDeRiesgoRequest = { factorDeRiesgoIds }
  await api.put(`${BASE_PATH}/${pacienteId}/factores-de-riesgo`, body)
}

/** RF-25 — POST api/pacientes/{id}/contactos */
export async function agregarContacto(
  pacienteId: string,
  contacto: ContactoInput,
): Promise<string> {
  const body: AgregarContactoRequest = {
    nombre: contacto.nombre,
    telefono: contacto.telefono,
    apellido: contacto.apellido || null,
    parentesco: contacto.parentesco || null,
  }

  const { data } = await api.post<{ id: string }>(`${BASE_PATH}/${pacienteId}/contactos`, body)
  return data.id
}

/** RF-25 — PUT api/pacientes/{id}/contactos/{contactoId} */
export async function modificarContacto(
  pacienteId: string,
  contactoId: string,
  contacto: ContactoInput,
): Promise<void> {
  const body: ModificarContactoRequest = {
    nombre: contacto.nombre,
    telefono: contacto.telefono,
    apellido: contacto.apellido || null,
    parentesco: contacto.parentesco || null,
  }

  await api.put(`${BASE_PATH}/${pacienteId}/contactos/${contactoId}`, body)
}

/** RF-25 — DELETE api/pacientes/{id}/contactos/{contactoId} */
export async function eliminarContacto(pacienteId: string, contactoId: string): Promise<void> {
  await api.delete(`${BASE_PATH}/${pacienteId}/contactos/${contactoId}`)
}

/** RF-35 — POST api/pacientes/{id}/estudios */
export async function crearEstudio(
  pacienteId: string,
  payload: CrearEstudioPayload,
): Promise<string> {
  const body: CrearEstudioRequest = {
    tipoEstudioId: payload.tipoEstudioId,
    titulo: payload.titulo,
    fecha: payload.fecha,
    descripcion: payload.descripcion,
  }

  const { data } = await api.post<{ id: string }>(`${BASE_PATH}/${pacienteId}/estudios`, body)
  return data.id
}

/** RF-36 — DELETE api/pacientes/{id}/estudios/{estudioId} */
export async function eliminarEstudio(pacienteId: string, estudioId: string): Promise<void> {
  await api.delete(`${BASE_PATH}/${pacienteId}/estudios/${estudioId}`)
}
