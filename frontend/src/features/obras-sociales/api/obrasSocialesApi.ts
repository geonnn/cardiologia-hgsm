// Acceso a ObrasSocialesController (api/obras-sociales).
import type { AxiosRequestConfig } from 'axios'
import type { CatalogoNombreRequest, ObraSocialDto } from '@/api/types'
import { api } from '@/lib/api'

/** El DTO del backend ya coincide con lo que necesita la vista: { id, nombre }. */
export type ObraSocial = ObraSocialDto

/**
 * Configuración de axios para RF-21 / RF-21.1 — GET api/obras-sociales?busqueda=
 * El backend devuelve la lista ordenada alfabéticamente y filtra por coincidencia parcial del nombre
 * (sin distinguir mayúsculas).
 */
export const listarObrasSocialesRequest = (busqueda?: string): AxiosRequestConfig => ({
  method: 'get',
  url: '/obras-sociales',
  params: { busqueda: busqueda?.trim() || undefined },
})

/** RF-20 — POST api/obras-sociales. Devuelve el id de la obra social creada. */
export async function crearObraSocial(nombre: string): Promise<number> {
  const payload: CatalogoNombreRequest = { nombre }
  const { data } = await api.post<{ id: number }>('/obras-sociales', payload)
  return data.id
}

/** RF-22 — PUT api/obras-sociales/{id} */
export async function modificarObraSocial(id: number, nombre: string): Promise<void> {
  const payload: CatalogoNombreRequest = { nombre }
  await api.put(`/obras-sociales/${id}`, payload)
}

/** RF-23 — DELETE api/obras-sociales/{id}. Responde 409 (Catalogo.EnUso) si está asociada a una internación. */
export async function eliminarObraSocial(id: number): Promise<void> {
  await api.delete(`/obras-sociales/${id}`)
}
