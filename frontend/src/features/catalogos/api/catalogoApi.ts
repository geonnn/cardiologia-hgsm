// Acceso a los controllers de catálogos (ObrasSocialesController, TiposEstudioController, ...).
// Todos exponen los mismos endpoints sobre su `recurso`.
import type { AxiosRequestConfig } from 'axios'
import type { CatalogoNombreRequest } from '@/api/types'
import { api } from '@/lib/api'

/**
 * Configuración de axios para listar — GET api/{recurso}?busqueda=
 * El backend devuelve la lista ordenada alfabéticamente y filtra por coincidencia parcial del nombre
 * (sin distinguir mayúsculas).
 */
export const listarCatalogoRequest = (recurso: string, busqueda?: string): AxiosRequestConfig => ({
  method: 'get',
  url: recurso,
  params: { busqueda: busqueda?.trim() || undefined },
})

/** POST api/{recurso}. Devuelve el id creado. Responde 409 (Catalogo.NombreDuplicado) si el nombre existe. */
export async function crearItemCatalogo(recurso: string, nombre: string): Promise<number> {
  const payload: CatalogoNombreRequest = { nombre }
  const { data } = await api.post<{ id: number }>(recurso, payload)
  return data.id
}

/** PUT api/{recurso}/{id} */
export async function modificarItemCatalogo(recurso: string, id: number, nombre: string): Promise<void> {
  const payload: CatalogoNombreRequest = { nombre }
  await api.put(`${recurso}/${id}`, payload)
}

/** DELETE api/{recurso}/{id}. Responde 409 (Catalogo.EnUso) si está en uso. */
export async function eliminarItemCatalogo(recurso: string, id: number): Promise<void> {
  await api.delete(`${recurso}/${id}`)
}
