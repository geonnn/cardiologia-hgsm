import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  agregarPendiente,
  desmarcarRealizacionPendiente,
  listarPendientesRequest,
  registrarRealizacionPendiente,
  type AgregarPendienteRequest,
  type PaginatedListOfPendienteDto,
} from '../api/internacionesApi'

export type FiltroEstadoPendiente = 'todos' | 'pendientes' | 'realizados'

const PAGE_SIZE = 10

const estadoABool = (estado: FiltroEstadoPendiente): boolean | undefined => {
  if (estado === 'realizados') return true
  if (estado === 'pendientes') return false
  return undefined
}

/** Gestión de pendientes asistenciales de una internación (HU-32 a HU-34 / RF-44 a RF-46 + reversión). */
export function usePendientesInternacion(internacionId: string | undefined) {
  const [page, setPage] = useState(1)
  const [estado, setEstado] = useState<FiltroEstadoPendiente>('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [ascendente, setAscendente] = useState(false)
  const [version, setVersion] = useState(0)
  const [procesandoIds, setProcesandoIds] = useState<Record<string, boolean>>({})

  const query = useApiQuery<PaginatedListOfPendienteDto>(
    listarPendientesRequest(internacionId ?? '', {
      page,
      pageSize: PAGE_SIZE,
      realizado: estadoABool(estado),
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

  const actualizarEstado = (valor: FiltroEstadoPendiente) => {
    setEstado(valor)
    setPage(1)
  }

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
    setEstado('todos')
    setFechaDesde('')
    setFechaHasta('')
    setAscendente(false)
    setPage(1)
  }

  const agregar = async (payload: AgregarPendienteRequest) => {
    if (!internacionId) return
    await agregarPendiente(internacionId, payload)
    setPage(1)
    recargar()
  }

  const ejecutarSobrePendiente = async (
    pendienteId: string,
    accion: (idInternacion: string, idPendiente: string) => Promise<void>,
  ) => {
    if (!internacionId) return
    setProcesandoIds((prev) => ({ ...prev, [pendienteId]: true }))
    try {
      await accion(internacionId, pendienteId)
      recargar()
    } finally {
      setProcesandoIds((prev) => {
        const next = { ...prev }
        delete next[pendienteId]
        return next
      })
    }
  }

  const marcarRealizado = (pendienteId: string) =>
    ejecutarSobrePendiente(pendienteId, registrarRealizacionPendiente)

  const desmarcarRealizado = (pendienteId: string) =>
    ejecutarSobrePendiente(pendienteId, desmarcarRealizacionPendiente)

  const tieneFiltrosActivos = Boolean(
    estado !== 'todos' || fechaDesde || fechaHasta || ascendente,
  )

  return {
    page,
    setPage,
    estado,
    setEstado: actualizarEstado,
    fechaDesde,
    setFechaDesde: actualizarFechaDesde,
    fechaHasta,
    setFechaHasta: actualizarFechaHasta,
    ascendente,
    setAscendente: actualizarAscendente,
    limpiarFiltros,
    tieneFiltrosActivos,
    pendientes: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
    totalPages: Math.max(1, query.data?.totalPages ?? 1),
    cargandoInicial: query.cargando && query.data === undefined,
    actualizando: query.cargando && query.data !== undefined,
    error: query.error,
    recargar,
    agregar,
    marcarRealizado,
    desmarcarRealizado,
    estaProcesando: (pendienteId: string) => Boolean(procesandoIds[pendienteId]),
  }
}
