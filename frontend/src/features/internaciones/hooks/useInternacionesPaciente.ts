import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  listarInternacionesPorPacienteRequest,
  type PaginatedListOfInternacionResumenDto,
} from '../api/internacionesApi'

const PAGE_SIZE = 10

/** Listado paginado, ordenamiento y filtrado temporal de internaciones de un paciente (RF-48 / 48.1 / 48.2). */
export function useInternacionesPaciente(pacienteId: string | undefined) {
  const [page, setPage] = useState(1)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [ascendente, setAscendente] = useState(false)
  const [version, setVersion] = useState(0)

  const query = useApiQuery<PaginatedListOfInternacionResumenDto>(
    listarInternacionesPorPacienteRequest(pacienteId ?? '', {
      page,
      pageSize: PAGE_SIZE,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      ascendente,
    }),
    {
      deps: [version],
      enabled: Boolean(pacienteId),
    },
  )

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

  const recargar = () => setVersion((v) => v + 1)

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
    internaciones: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    totalPages: Math.max(1, query.data?.totalPages ?? 1),
    cargandoInicial: query.cargando && query.data === undefined,
    actualizando: query.cargando && query.data !== undefined,
    error: query.error,
    recargar,
  }
}
