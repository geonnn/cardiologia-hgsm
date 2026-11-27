import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  listarFactoresDeRiesgoRequest,
  listarMotivosInternacionRequest,
  type FactorDeRiesgo,
  type MotivoInternacion,
} from '../api/catalogosApi'
import {
  listarPacientesRequest,
  type PacienteOrden,
  type PacienteResumen,
  type PaginatedList,
  type Sexo,
} from '../api/pacientesApi'

const PAGE_SIZE = 10

export type EstadoInternacionFiltro = 'todos' | 'activos' | 'sin_activa'

/**
 * Estado del listado paginado de pacientes contra PacientesController (RF-26 / 26.1 / 26.2 / 26.3).
 */
export function usePacientes() {
  const [busqueda, setBusqueda] = useState('')
  const [estadoInternacion, setEstadoInternacion] = useState<EstadoInternacionFiltro>('todos')
  const [motivoId, setMotivoId] = useState<number | undefined>(undefined)
  const [factorId, setFactorId] = useState<number | undefined>(undefined)
  const [sexo, setSexo] = useState<Sexo | ''>('')
  const [fechaCargaDesde, setFechaCargaDesde] = useState('')
  const [fechaCargaHasta, setFechaCargaHasta] = useState('')
  const [ordenarPor, setOrdenarPor] = useState<PacienteOrden>('Alfabetico')
  const [descendente, setDescendente] = useState(false)
  const [page, setPage] = useState(1)
  const [version, setVersion] = useState(0)

  const busquedaDebounced = useDebouncedValue(busqueda.trim(), 250)

  const motivosQuery = useApiQuery<MotivoInternacion[]>(listarMotivosInternacionRequest())
  const factoresQuery = useApiQuery<FactorDeRiesgo[]>(listarFactoresDeRiesgoRequest())

  const conInternacionActiva =
    estadoInternacion === 'todos' ? undefined : estadoInternacion === 'activos'

  const pacientesQuery = useApiQuery<PaginatedList<PacienteResumen>>(
    listarPacientesRequest({
      page,
      pageSize: PAGE_SIZE,
      busqueda: busquedaDebounced || undefined,
      sexo: sexo || undefined,
      factorDeRiesgoId: factorId,
      motivoInternacionId: motivoId,
      conInternacionActiva,
      fechaCargaDesde: fechaCargaDesde || undefined,
      fechaCargaHasta: fechaCargaHasta || undefined,
      ordenarPor,
      descendente,
    }),
    { deps: [version] },
  )

  // Sin filtros y con una sola fila: sólo interesa `totalCount`, para distinguir
  // "no hay pacientes cargados" de "ningún paciente coincide con los filtros"
  const totalSinFiltrosQuery = useApiQuery<PaginatedList<PacienteResumen>>(
    listarPacientesRequest({ page: 1, pageSize: 1 }),
    { deps: [version] },
  )

  const actualizarBusqueda = (valor: string) => {
    setBusqueda(valor)
    setPage(1)
  }

  const actualizarEstadoInternacion = (valor: EstadoInternacionFiltro) => {
    setEstadoInternacion(valor)
    setPage(1)
  }

  const actualizarMotivo = (valor: number | undefined) => {
    setMotivoId(valor)
    setPage(1)
  }

  const actualizarFactor = (valor: number | undefined) => {
    setFactorId(valor)
    setPage(1)
  }

  const actualizarSexo = (valor: Sexo | '') => {
    setSexo(valor)
    setPage(1)
  }

  const actualizarFechaDesde = (valor: string) => {
    setFechaCargaDesde(valor)
    setPage(1)
  }

  const actualizarFechaHasta = (valor: string) => {
    setFechaCargaHasta(valor)
    setPage(1)
  }

  const actualizarOrden = (valor: PacienteOrden) => {
    setOrdenarPor(valor)
    setPage(1)
  }

  const actualizarDescendente = (valor: boolean) => {
    setDescendente(valor)
    setPage(1)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setEstadoInternacion('todos')
    setMotivoId(undefined)
    setFactorId(undefined)
    setSexo('')
    setFechaCargaDesde('')
    setFechaCargaHasta('')
    setOrdenarPor('Alfabetico')
    setDescendente(false)
    setPage(1)
  }

  const recargar = () => setVersion((v) => v + 1)

  const tieneFiltrosActivos = Boolean(
    busqueda.trim() ||
      estadoInternacion !== 'todos' ||
      motivoId !== undefined ||
      factorId !== undefined ||
      sexo ||
      fechaCargaDesde ||
      fechaCargaHasta ||
      ordenarPor !== 'Alfabetico' ||
      descendente,
  )

  return {
    busqueda,
    setBusqueda: actualizarBusqueda,
    estadoInternacion,
    setEstadoInternacion: actualizarEstadoInternacion,
    motivoId,
    setMotivoId: actualizarMotivo,
    factorId,
    setFactorId: actualizarFactor,
    sexo,
    setSexo: actualizarSexo,
    fechaCargaDesde,
    setFechaCargaDesde: actualizarFechaDesde,
    fechaCargaHasta,
    setFechaCargaHasta: actualizarFechaHasta,
    ordenarPor,
    setOrdenarPor: actualizarOrden,
    descendente,
    setDescendente: actualizarDescendente,
    page,
    setPage,
    limpiarFiltros,
    tieneFiltrosActivos,
    motivos: motivosQuery.data ?? [],
    factores: factoresQuery.data ?? [],
    catalogosError: motivosQuery.error ?? factoresQuery.error,
    pacientes: pacientesQuery.data?.items ?? [],
    totalCount: pacientesQuery.data?.totalCount ?? 0,
    /** Si hay al menos un paciente en el sistema, sin importar los filtros. Mientras no se sabe, se asume que sí hay si hay filtros. */
    hayPacientesCargados: totalSinFiltrosQuery.data
      ? totalSinFiltrosQuery.data.totalCount > 0
      : tieneFiltrosActivos,
    totalPages: Math.max(1, pacientesQuery.data?.totalPages ?? 1),
    cargandoInicial: pacientesQuery.cargando && pacientesQuery.data === undefined,
    actualizando: pacientesQuery.cargando && pacientesQuery.data !== undefined,
    error: pacientesQuery.error,
    recargar,
  }
}
