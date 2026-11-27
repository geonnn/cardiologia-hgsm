import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  crearEvolucion,
  listarEvolucionesRequest,
  type CrearEvolucionRequest,
  type PaginatedListOfEvolucionDto,
} from '../api/internacionesApi'

const PAGE_SIZE = 10

/** Listado paginado, ordenamiento, filtrado y alta de evoluciones médicas de una internación (HU-23, HU-24). */
export function useEvolucionesInternacion(internacionId: string | undefined) {
  const [page, setPage] = useState(1)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [ascendente, setAscendente] = useState(false)
  const [version, setVersion] = useState(0)

  const query = useApiQuery<PaginatedListOfEvolucionDto>(
    listarEvolucionesRequest(internacionId ?? '', {
      page,
      pageSize: PAGE_SIZE,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      ascendente,
    }),
    {
      deps: [version],
      enabled: Boolean(internacionId),
    },
  )

  const recargar = () => setVersion((v) => v + 1)

  const actualizarFechaDesde = (valor: string) => {
    setFechaDesde(valor)
    setPage(1)
  }

  const actualizarFechaHasta = (valor: string) => {
    setFechaHasta(valor)
    setPage(1)
  }

  const actualizarAscendente = (valor: boolean) => {
    setAscendente(valor)
    setPage(1)
  }

  const limpiarFiltros = () => {
    setFechaDesde('')
    setFechaHasta('')
    setAscendente(false)
    setPage(1)
  }

  const crear = async (payload: CrearEvolucionRequest) => {
    if (!internacionId) return
    await crearEvolucion(internacionId, payload)
    setPage(1)
    recargar()
  }

  const tieneFiltrosActivos = Boolean(fechaDesde || fechaHasta || ascendente)

  return {
    page,
    setPage,
    fechaDesde,
    setFechaDesde: actualizarFechaDesde,
    fechaHasta,
    setFechaHasta: actualizarFechaHasta,
    ascendente,
    setAscendente: actualizarAscendente,
    limpiarFiltros,
    tieneFiltrosActivos,
    evoluciones: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    totalPages: Math.max(1, query.data?.totalPages ?? 1),
    cargandoInicial: query.cargando && query.data === undefined,
    actualizando: query.cargando && query.data !== undefined,
    error: query.error,
    recargar,
    crear,
  }
}
