// Acceso a InternacionesController (api/internaciones) y consultas por paciente (api/pacientes/{id}/internaciones*).
import type { AxiosRequestConfig } from 'axios'
import type {
  CamaDto,
  CondicionAlta,
  CrearInternacionRequest,
  EstadoCamaTipo,
  InternacionCamaDto,
  InternacionDetalleDto,
  InternacionPacienteDto,
  InternacionResumenDto,
  Manejo,
  ModificarInternacionRequest,
  MotivoInternacionDto,
  ObraSocialDto,
  PacienteDetalleDto,
  PacienteResumenDto,
  PaginatedListOfInternacionResumenDto,
  PaginatedListOfPacienteResumenDto,
  RegistrarAltaRequest,
} from '@/api/types'
import { api } from '@/lib/api'

export type {
  CamaDto,
  CondicionAlta,
  EstadoCamaTipo,
  InternacionCamaDto,
  InternacionDetalleDto,
  InternacionPacienteDto,
  InternacionResumenDto,
  Manejo,
  MotivoInternacionDto,
  ObraSocialDto,
  PacienteDetalleDto,
  PacienteResumenDto,
  PaginatedListOfInternacionResumenDto,
  PaginatedListOfPacienteResumenDto,
}

export type InternacionResumen = InternacionResumenDto
export type InternacionDetalle = InternacionDetalleDto

export interface FiltrosInternacionesPaciente {
  page?: number
  pageSize?: number
  fechaDesde?: string
  fechaHasta?: string
  ascendente?: boolean
}

export interface CrearInternacionPayload {
  pacienteId: string
  camaId: string
  enfermedadActual: string
  motivoInternacionIds: number[]
  manejo?: Manejo | null
  fechaInternacion?: string | null
  obraSocialId?: number | null
  aislamiento?: string | null
  camaAislamientoId?: string | null
  parametrosAntropometria?: string | null
  tratamientoPrevio?: string | null
  tratamientoActual?: string | null
  observaciones?: string | null
}

export interface ModificarInternacionPayload {
  camaId: string
  fechaInternacion: string
  manejo: Manejo
  enfermedadActual: string
  motivoInternacionIds: number[]
  obraSocialId?: number | null
  aislamiento?: string | null
  camaAislamientoId?: string | null
  parametrosAntropometria?: string | null
  tratamientoPrevio?: string | null
  observaciones?: string | null
}

export interface RegistrarAltaPayload {
  condicionAlta: CondicionAlta
  fechaFin: string
}

const BASE_PATH = '/internaciones'

// ---- Builders para useApiQuery ----

/** GET api/internaciones/{id} */
export const obtenerInternacionRequest = (id: string): AxiosRequestConfig => ({
  method: 'get',
  url: `${BASE_PATH}/${id}`,
})

/** GET api/pacientes/{pacienteId}/internacion-activa */
export const obtenerInternacionActivaRequest = (pacienteId: string): AxiosRequestConfig => ({
  method: 'get',
  url: `/pacientes/${pacienteId}/internacion-activa`,
})

/** HU-21 / RF-48, 48.1, 48.2 — GET api/pacientes/{pacienteId}/internaciones */
export const listarInternacionesPorPacienteRequest = (
  pacienteId: string,
  params: FiltrosInternacionesPaciente = {},
): AxiosRequestConfig => ({
  method: 'get',
  url: `/pacientes/${pacienteId}/internaciones`,
  params: {
    page: params.page,
    pageSize: params.pageSize,
    fechaDesde: params.fechaDesde || undefined,
    fechaHasta: params.fechaHasta || undefined,
    ascendente: params.ascendente,
  },
})

// ---- Builders auxiliares de catálogos y selectores ----

export const listarCamasInternacionRequest = (estado?: EstadoCamaTipo): AxiosRequestConfig => ({
  method: 'get',
  url: '/camas',
  params: { estado },
})

export const listarMotivosInternacionRequest = (): AxiosRequestConfig => ({
  method: 'get',
  url: '/motivos-internacion',
})

export const listarObrasSocialesRequest = (): AxiosRequestConfig => ({
  method: 'get',
  url: '/obras-sociales',
})

export const buscarPacientesRequest = (busqueda: string): AxiosRequestConfig => ({
  method: 'get',
  url: '/pacientes',
  params: {
    busqueda: busqueda.trim() || undefined,
    page: 1,
    pageSize: 8,
  },
})

export const obtenerPacientePorIdRequest = (id: string): AxiosRequestConfig => ({
  method: 'get',
  url: `/pacientes/${id}`,
})

// ---- Mutaciones ----

/** HU-19 / RF-47 — POST api/internaciones */
export async function crearInternacion(payload: CrearInternacionPayload): Promise<string> {
  const body: CrearInternacionRequest = {
    pacienteId: payload.pacienteId,
    camaId: payload.camaId,
    enfermedadActual: payload.enfermedadActual,
    motivoInternacionIds: payload.motivoInternacionIds,
    manejo: payload.manejo ?? null,
    fechaInternacion: payload.fechaInternacion || null,
    obraSocialId: payload.obraSocialId ?? null,
    aislamiento: payload.aislamiento || null,
    camaAislamientoId: payload.camaAislamientoId || null,
    parametrosAntropometria: payload.parametrosAntropometria || null,
    tratamientoPrevio: payload.tratamientoPrevio || null,
    tratamientoActual: payload.tratamientoActual || null,
    observaciones: payload.observaciones || null,
  }

  const { data } = await api.post<{ id: string }>(BASE_PATH, body)
  return data.id
}

/** HU-20 / RF-49 — PUT api/internaciones/{id} */
export async function modificarInternacion(
  id: string,
  payload: ModificarInternacionPayload,
): Promise<void> {
  const body: ModificarInternacionRequest = {
    camaId: payload.camaId,
    fechaInternacion: payload.fechaInternacion,
    manejo: payload.manejo,
    enfermedadActual: payload.enfermedadActual,
    motivoInternacionIds: payload.motivoInternacionIds,
    obraSocialId: payload.obraSocialId ?? null,
    aislamiento: payload.aislamiento || null,
    camaAislamientoId: payload.camaAislamientoId || null,
    parametrosAntropometria: payload.parametrosAntropometria || null,
    tratamientoPrevio: payload.tratamientoPrevio || null,
    observaciones: payload.observaciones || null,
  }

  await api.put(`${BASE_PATH}/${id}`, body)
}

/** HU-22 / RF-50 — POST api/internaciones/{id}/alta */
export async function registrarAlta(id: string, payload: RegistrarAltaPayload): Promise<void> {
  const body: RegistrarAltaRequest = {
    condicionAlta: payload.condicionAlta,
    fechaFin: payload.fechaFin,
  }

  await api.post(`${BASE_PATH}/${id}/alta`, body)
}
