import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  crearObraSocial,
  eliminarObraSocial,
  listarObrasSocialesRequest,
  modificarObraSocial,
  type ObraSocial,
} from '../api/obrasSocialesApi'

/**
 * Estado de la vista de obras sociales contra la WebApi (ObrasSocialesController):
 * - `visibles`: GET api/obras-sociales?busqueda= con el texto buscado (RF-21 / RF-21.1).
 * - `todas`: GET api/obras-sociales sin búsqueda, para el total y para validar nombres duplicados.
 * Después de crear, modificar o eliminar se vuelven a pedir ambas listas.
 */
export function useObrasSociales() {
  const [busqueda, setBusqueda] = useState('')
  // Espera a que el usuario deje de tipear antes de consultar
  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 300)
  // Incrementar fuerza una nueva consulta de ambas listas
  const [version, setVersion] = useState(0)

  const todasQuery = useApiQuery<ObraSocial[]>(listarObrasSocialesRequest(), { deps: [version] })
  const visiblesQuery = useApiQuery<ObraSocial[]>(listarObrasSocialesRequest(busquedaDebounced), {
    deps: [version],
  })

  const recargar = () => setVersion((v) => v + 1)

  /** RF-20. Si la API devuelve error, se propaga para que el formulario lo muestre. */
  const crear = async (nombre: string) => {
    const id = await crearObraSocial(nombre)
    recargar()
    return id
  }

  /** RF-22. Si la API devuelve error, se propaga para que el formulario lo muestre. */
  const modificar = async (id: number, nombre: string) => {
    await modificarObraSocial(id, nombre)
    recargar()
  }

  /** RF-23. Si está asociada a una internación, la API responde 409 y el error se propaga. */
  const eliminar = async (id: number) => {
    await eliminarObraSocial(id)
    recargar()
  }

  return {
    busqueda,
    setBusqueda,
    /** Búsqueda que ya se envió a la API (la de `visibles`). */
    busquedaAplicada: busquedaDebounced,
    todas: todasQuery.data ?? [],
    visibles: visiblesQuery.data ?? [],
    /** true sólo en la primera carga (todavía no hay datos para mostrar). */
    cargandoInicial: visiblesQuery.cargando && visiblesQuery.data === undefined,
    /** true mientras se vuelve a consultar con datos ya en pantalla. */
    actualizando: visiblesQuery.cargando && visiblesQuery.data !== undefined,
    error: visiblesQuery.error ?? todasQuery.error,
    recargar,
    crear,
    modificar,
    eliminar,
  }
}
