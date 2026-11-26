// Acceso a catálogos consumidos desde el módulo de Pacientes y Estudios.
import type { AxiosRequestConfig } from 'axios'
import type {
  CatalogoNombreRequest,
  FactorDeRiesgoDto,
  MedicoDeCabeceraDto,
  MotivoInternacionDto,
  TipoEstudioDto,
} from '@/api/types'
import { api } from '@/lib/api'

export type FactorDeRiesgo = FactorDeRiesgoDto
export type MotivoInternacion = MotivoInternacionDto
export type MedicoDeCabecera = MedicoDeCabeceraDto
export type TipoEstudio = TipoEstudioDto

export const listarFactoresDeRiesgoRequest = (): AxiosRequestConfig => ({
  method: 'get',
  url: '/factores-de-riesgo',
})

export const listarMotivosInternacionRequest = (): AxiosRequestConfig => ({
  method: 'get',
  url: '/motivos-internacion',
})

export const listarTiposEstudioRequest = (): AxiosRequestConfig => ({
  method: 'get',
  url: '/tipos-estudio',
})

export const listarMedicosDeCabeceraRequest = (busqueda?: string): AxiosRequestConfig => ({
  method: 'get',
  url: '/medicos-de-cabecera',
  params: { busqueda: busqueda?.trim() || undefined },
})

/**
 * Busca si existe un médico de cabecera con ese nombre exacto (sin distinguir mayúsculas)
 * o lo da de alta en el catálogo para devolver su ID.
 */
export async function obtenerOCrearMedicoDeCabecera(nombre: string): Promise<string | null> {
  const nombreLimpio = nombre.trim()
  if (!nombreLimpio) return null

  const { data: medicos } = await api.request<MedicoDeCabecera[]>(
    listarMedicosDeCabeceraRequest(nombreLimpio),
  )
  const existente = medicos.find((m) => m.nombre.toLowerCase() === nombreLimpio.toLowerCase())
  if (existente) return existente.id

  const body: CatalogoNombreRequest = { nombre: nombreLimpio }
  const { data } = await api.post<{ id: string }>('/medicos-de-cabecera', body)
  return data.id
}
