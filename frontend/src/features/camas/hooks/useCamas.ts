import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  aCamas,
  cambiarEstadoCama,
  crearCama as crearCamaApi,
  listarCamasRequest,
  type AccionEstadoApi,
  type CamaDto,
} from '../api/camasApi'
import { SECTORES } from '../constants'
import type { Cama, FiltroEstado, NuevaCama, Sector } from '../types'
import { contarPorEstado, ordenarCamas } from '../utils'

/**
 * Estado de la vista de camas contra la WebApi (CamasController):
 * - `visibles`: GET api/camas?sector=&estado= con los filtros seleccionados (RF-11.1).
 * - `todas`: GET api/camas sin filtros, para los contadores de cada filtro y sector
 *   y para validar que el número de cama no se repita.
 * Después de crear o cambiar el estado de una cama se vuelven a pedir ambas listas.
 */
export function useCamas() {
  const [sector, setSector] = useState<Sector>(SECTORES[0])
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')
  // Incrementar fuerza una nueva consulta de ambas listas
  const [version, setVersion] = useState(0)

  const estado = filtro === 'todos' ? undefined : filtro

  const todasQuery = useApiQuery<CamaDto[], Cama[]>(listarCamasRequest(), { select: aCamas, deps: [version] })
  const visiblesQuery = useApiQuery<CamaDto[], Cama[]>(listarCamasRequest({ sector, estado }), {
    select: aCamas,
    deps: [version],
  })

  const todas = todasQuery.data ?? []
  const camasDelSector = todas.filter((c) => c.sector === sector)
  const conteos = contarPorEstado(camasDelSector)
  const visibles = [...(visiblesQuery.data ?? [])].sort(ordenarCamas)
  const totalPorSector = (s: Sector) => todas.filter((c) => c.sector === s).length

  const recargar = () => setVersion((v) => v + 1)

  const cambiarSector = (nuevo: Sector) => {
    setSector(nuevo)
    setFiltro('todos')
  }

  /** RF-10. Si la API devuelve error, se propaga para que el formulario lo muestre. */
  const crearCama = async (nueva: NuevaCama) => {
    const id = await crearCamaApi(nueva)
    // Mostrar el sector de la cama nueva, sin filtros, para que quede visible
    cambiarSector(nueva.sector)
    recargar()
    return id
  }

  /** RF-27 a RF-30. Si la API devuelve error (ej. 409), se propaga. */
  const cambiarEstado = async (cama: Cama, accion: AccionEstadoApi) => {
    await cambiarEstadoCama(cama.id, accion)
    recargar()
  }

  return {
    sector,
    filtro,
    todas,
    visibles,
    conteos,
    totalPorSector,
    /** true sólo en la primera carga (todavía no hay datos para mostrar). */
    cargandoInicial: visiblesQuery.cargando && visiblesQuery.data === undefined,
    /** true mientras se vuelve a consultar con datos ya en pantalla. */
    actualizando: visiblesQuery.cargando && visiblesQuery.data !== undefined,
    error: visiblesQuery.error ?? todasQuery.error,
    recargar,
    cambiarSector,
    setFiltro,
    crearCama,
    cambiarEstado,
  }
}
