// Acceso a CamasController (api/camas). Traduce los DTOs del backend al modelo del front.
import type { AxiosRequestConfig } from 'axios'
import type { CamaDto, CrearCamaRequest, EstadoCamaTipo } from '@/api/types'
import { api } from '@/lib/api'
import type { Cama, EstadoCama, NuevaCama, Sector } from '../types'

export type { CamaDto }

/** Endpoints de cambio de estado: POST api/camas/{id}/{accion} (RF-27 a RF-30). */
export type AccionEstadoApi = 'bloquear' | 'desbloquear' | 'deshabilitar' | 'habilitar'

// ---- Mapeo de enums ----

const ESTADO_DESDE_API: Record<EstadoCamaTipo, EstadoCama> = {
  Disponible: 'disponible',
  Ocupada: 'ocupada',
  EnAislamiento: 'aislamiento',
  Deshabilitada: 'deshabilitada',
}

const ESTADO_A_API: Record<EstadoCama, EstadoCamaTipo> = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  aislamiento: 'EnAislamiento',
  deshabilitada: 'Deshabilitada',
}

const aCama = (dto: CamaDto): Cama => ({
  id: dto.id,
  numero: dto.numeroCama,
  sector: dto.sector,
  estado: ESTADO_DESDE_API[dto.estado],
  paciente: dto.ocupante
    ? {
        internacionId: dto.ocupante.internacionId,
        pacienteId: dto.ocupante.pacienteId,
        nombreCompleto: `${dto.ocupante.nombre} ${dto.ocupante.apellido}`,
        edad: dto.ocupante.edad,
        sexo: dto.ocupante.sexo,
        motivosInternacion: dto.ocupante.motivosInternacion,
        diasInternado: dto.ocupante.diasInternado,
      }
    : undefined,
})

/** Convierte la respuesta de GET api/camas al modelo del front. */
export const aCamas = (dtos: CamaDto[]): Cama[] => dtos.map(aCama)

// ---- Endpoints ----

export interface FiltrosCamas {
  sector?: Sector
  estado?: EstadoCama
}

/** Configuración de axios para RF-11 / RF-11.1 — GET api/camas?sector=&estado= */
export const listarCamasRequest = (filtros: FiltrosCamas = {}): AxiosRequestConfig => ({
  method: 'get',
  url: '/camas',
  params: {
    sector: filtros.sector,
    estado: filtros.estado ? ESTADO_A_API[filtros.estado] : undefined,
  },
})

/** RF-11 / RF-11.1 — GET api/camas?sector=&estado= */
export async function listarCamas(filtros: FiltrosCamas = {}, signal?: AbortSignal): Promise<Cama[]> {
  const { data } = await api.request<CamaDto[]>({ ...listarCamasRequest(filtros), signal })
  return aCamas(data)
}

/** GET api/camas/{id} */
export async function obtenerCama(id: string, signal?: AbortSignal): Promise<Cama> {
  const { data } = await api.get<CamaDto>(`/camas/${id}`, { signal })
  return aCama(data)
}

/** RF-10 — POST api/camas. Devuelve el id de la cama creada. */
export async function crearCama({ numero, sector }: NuevaCama): Promise<string> {
  const payload: CrearCamaRequest = { numeroCama: numero, sector }
  const { data } = await api.post<{ id: string }>('/camas', payload)
  return data.id
}

/** RF-27 a RF-30 — POST api/camas/{id}/{accion} */
export async function cambiarEstadoCama(id: string, accion: AccionEstadoApi): Promise<void> {
  await api.post(`/camas/${id}/${accion}`)
}
