import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  crearItemCatalogo,
  eliminarItemCatalogo,
  listarCatalogoRequest,
  modificarItemCatalogo,
} from '../api/catalogoApi'
import type { ItemCatalogo } from '../types'

/**
 * Estado de la vista de un catálogo contra la WebApi:
 * - `visibles`: GET api/{recurso}?busqueda= con el texto buscado (listar + buscar).
 * - `todos`: GET api/{recurso} sin búsqueda, para el total y para validar nombres duplicados.
 * Después de crear, modificar o eliminar se vuelven a pedir ambas listas.
 */
export function useCatalogo(recurso: string) {
  const [busqueda, setBusqueda] = useState('')
  // Espera a que el usuario deje de tipear antes de consultar
  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300)
  // Incrementar fuerza una nueva consulta de ambas listas
  const [version, setVersion] = useState(0)

  const todosQuery = useApiQuery<ItemCatalogo[]>(listarCatalogoRequest(recurso), { deps: [version] })
  const visiblesQuery = useApiQuery<ItemCatalogo[]>(listarCatalogoRequest(recurso, busquedaDebounced), {
    deps: [version],
  })

  const recargar = () => setVersion((v) => v + 1)

  /** Si la API devuelve error, se propaga para que el formulario lo muestre. */
  const crear = async (nombre: string) => {
    const id = await crearItemCatalogo(recurso, nombre)
    recargar()
    return id
  }

  /** Si la API devuelve error, se propaga para que el formulario lo muestre. */
  const modificar = async (id: number, nombre: string) => {
    await modificarItemCatalogo(recurso, id, nombre)
    recargar()
  }

  /** Si está en uso, la API responde 409 y el error se propaga. */
  const eliminar = async (id: number) => {
    await eliminarItemCatalogo(recurso, id)
    recargar()
  }

  return {
    busqueda,
    setBusqueda,
    /** Búsqueda que ya se envió a la API (la de `visibles`). */
    busquedaAplicada: busquedaDebounced,
    todos: todosQuery.data ?? [],
    visibles: visiblesQuery.data ?? [],
    /** true sólo en la primera carga (todavía no hay datos para mostrar). */
    cargandoInicial: visiblesQuery.cargando && visiblesQuery.data === undefined,
    /** true mientras se vuelve a consultar con datos ya en pantalla. */
    actualizando: visiblesQuery.cargando && visiblesQuery.data !== undefined,
    error: visiblesQuery.error ?? todosQuery.error,
    recargar,
    crear,
    modificar,
    eliminar,
  }
}
