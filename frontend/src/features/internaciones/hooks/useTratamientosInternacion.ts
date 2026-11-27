import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  crearTratamiento,
  eliminarTratamiento,
  listarTratamientosRequest,
  modificarTratamiento,
  type CrearTratamientoRequest,
  type ModificarTratamientoRequest,
  type PaginatedListOfTratamientoDto,
} from '../api/internacionesApi'

const PAGE_SIZE = 10

/** Listado, alta, edición del último tratamiento y baja de indicaciones de una internación (HU-25 a HU-28). */
export function useTratamientosInternacion(
  internacionId: string | undefined,
  estaActiva: boolean,
) {
  const [page, setPage] = useState(1)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [ascendente, setAscendente] = useState(false)
  const [version, setVersion] = useState(0)

  const tieneFiltrosActivos = Boolean(fechaDesde || fechaHasta || ascendente)

  const query = useApiQuery<PaginatedListOfTratamientoDto>(
    listarTratamientosRequest(internacionId ?? '', {
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

  // Cuando la vista actual está filtrada o paginada, obtenemos el esquema vigente
  // para que "Copiar esquema vigente" esté siempre disponible al crear un nuevo tratamiento.
  const necesitaConsultaVigente = Boolean(internacionId) && estaActiva && (tieneFiltrosActivos || page > 1)
  const queryVigente = useApiQuery<PaginatedListOfTratamientoDto>(
    listarTratamientosRequest(internacionId ?? '', {
      page: 1,
      pageSize: 1,
      ascendente: false,
    }),
    {
      deps: [version],
      enabled: necesitaConsultaVigente,
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

  const crear = async (payload: CrearTratamientoRequest) => {
    if (!internacionId) return
    await crearTratamiento(internacionId, payload)
    setPage(1)
    recargar()
  }

  const modificar = async (tratamientoId: string, payload: ModificarTratamientoRequest) => {
    if (!internacionId) return
    await modificarTratamiento(internacionId, tratamientoId, payload)
    recargar()
  }

  const eliminar = async (tratamientoId: string) => {
    if (!internacionId) return
    await eliminarTratamiento(internacionId, tratamientoId)
    recargar()
  }

  const tratamientos = query.data?.items ?? []
  const tratamientoVigente =
    tratamientos.find((t) => t.esUltimo) ??
    (necesitaConsultaVigente ? (queryVigente.data?.items[0] ?? null) : null)

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
    tratamientos,
    tratamientoVigente,
    totalCount: query.data?.totalCount ?? 0,
    totalPages: Math.max(1, query.data?.totalPages ?? 1),
    cargandoInicial: query.cargando && query.data === undefined,
    actualizando: query.cargando && query.data !== undefined,
    error: query.error,
    recargar,
    crear,
    modificar,
    eliminar,
  }
}
