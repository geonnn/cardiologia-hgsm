import { useState } from 'react'
import { aCamas, listarCamasRequest, type Cama, type CamaDto, type Sector } from '@/features/camas'
import {
  listarPacientesRequest,
  type PacienteResumen,
  type PaginatedList,
} from '@/features/pacientes'
import { useApiQuery } from '@/hooks/useApiQuery'

export interface ResumenSector {
  sector: Sector
  total: number
  habilitadas: number
  ocupadas: number
  disponibles: number
  aislamiento: number
  deshabilitadas: number
  porcentajeOcupacion: number
}

export interface InternacionActivaResumen {
  internacionId: string
  pacienteId: string
  nombreCompleto: string
  edad: number
  sector: Sector
  numeroCama: number
  diasInternado: number
  motivos: ReadonlyArray<string>
}

const calcularResumenSector = (camas: ReadonlyArray<Cama>, sector: Sector): ResumenSector => {
  const delSector = camas.filter((c) => c.sector === sector)
  let ocupadas = 0
  let disponibles = 0
  let aislamiento = 0
  let deshabilitadas = 0

  for (const cama of delSector) {
    if (cama.estado === 'ocupada') ocupadas += 1
    else if (cama.estado === 'disponible') disponibles += 1
    else if (cama.estado === 'aislamiento') aislamiento += 1
    else if (cama.estado === 'deshabilitada') deshabilitadas += 1
  }

  const total = delSector.length
  const habilitadas = total - deshabilitadas
  const porcentajeOcupacion = habilitadas > 0 ? Math.round((ocupadas / habilitadas) * 100) : 0

  return {
    sector,
    total,
    habilitadas,
    ocupadas,
    disponibles,
    aislamiento,
    deshabilitadas,
    porcentajeOcupacion,
  }
}

/** Datos agregados en tiempo real para la plantilla del dashboard de inicio (`/`). */
export function useDashboard() {
  const [version, setVersion] = useState(0)

  const camasQuery = useApiQuery<CamaDto[]>(listarCamasRequest(), { deps: [version] })
  const pacientesRecientesQuery = useApiQuery<PaginatedList<PacienteResumen>>(
    listarPacientesRequest({
      page: 1,
      pageSize: 4,
      ordenarPor: 'FechaCarga',
      descendente: true,
    }),
    { deps: [version] },
  )

  const camas = camasQuery.data ? aCamas(camasQuery.data) : []
  const uco = calcularResumenSector(camas, 'UCO')
  const sala = calcularResumenSector(camas, 'Sala')

  const totalCamas = uco.total + sala.total
  const camasHabilitadas = uco.habilitadas + sala.habilitadas
  const camasOcupadas = uco.ocupadas + sala.ocupadas
  const camasDisponibles = uco.disponibles + sala.disponibles
  const camasAislamiento = uco.aislamiento + sala.aislamiento
  const camasDeshabilitadas = uco.deshabilitadas + sala.deshabilitadas
  const porcentajeOcupacion =
    camasHabilitadas > 0 ? Math.round((camasOcupadas / camasHabilitadas) * 100) : 0

  const internacionesMayorEstadia: InternacionActivaResumen[] = camas
    .filter((cama): cama is Cama & { paciente: NonNullable<Cama['paciente']> } =>
      Boolean(cama.paciente),
    )
    .map((cama) => ({
      internacionId: cama.paciente.internacionId,
      pacienteId: cama.paciente.pacienteId,
      nombreCompleto: cama.paciente.nombreCompleto,
      edad: cama.paciente.edad,
      sector: cama.sector,
      numeroCama: cama.numero,
      diasInternado: cama.paciente.diasInternado,
      motivos: cama.paciente.motivosInternacion,
    }))
    .sort((a, b) => b.diasInternado - a.diasInternado || a.numeroCama - b.numeroCama)
    .slice(0, 4)

  const recargar = () => setVersion((v) => v + 1)

  const cargandoInicial =
    (camasQuery.cargando && camasQuery.data === undefined) ||
    (pacientesRecientesQuery.cargando && pacientesRecientesQuery.data === undefined)

  const actualizando =
    (camasQuery.cargando && camasQuery.data !== undefined) ||
    (pacientesRecientesQuery.cargando && pacientesRecientesQuery.data !== undefined)

  return {
    uco,
    sala,
    totalCamas,
    camasHabilitadas,
    camasOcupadas,
    camasDisponibles,
    camasAislamiento,
    camasDeshabilitadas,
    porcentajeOcupacion,
    internacionesMayorEstadia,
    totalPacientes: pacientesRecientesQuery.data?.totalCount ?? 0,
    pacientesRecientes: pacientesRecientesQuery.data?.items ?? [],
    cargandoInicial,
    actualizando,
    errorCamas: camasQuery.error,
    errorPacientes: pacientesRecientesQuery.error,
    recargar,
  }
}
