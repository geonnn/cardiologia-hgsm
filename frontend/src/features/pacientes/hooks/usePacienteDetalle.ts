import { useState } from 'react'
import {
  obtenerInternacionActivaRequest,
  type InternacionDetalle,
} from '@/features/internaciones'
import { useApiQuery } from '@/hooks/useApiQuery'
import { obtenerOCrearMedicoDeCabecera } from '../api/catalogosApi'
import {
  agregarContacto,
  crearEstudio,
  eliminarContacto,
  eliminarEstudio,
  listarEstudiosRequest,
  modificarContacto,
  modificarPaciente,
  obtenerPacienteRequest,
  reemplazarFactoresDeRiesgo,
  type ContactoInput,
  type CrearEstudioPayload,
  type Estudio,
  type ModificarPacientePayload,
  type PacienteDetalle,
  type PaginatedList,
} from '../api/pacientesApi'

/**
 * Estado de la ficha clínica de un paciente y sus estudios complementarios.
 */
export function usePacienteDetalle(id: string | undefined) {
  const [pacienteVersion, setPacienteVersion] = useState(0)
  const [estudiosVersion, setEstudiosVersion] = useState(0)

  const habilitado = Boolean(id)

  const pacienteQuery = useApiQuery<PacienteDetalle>(obtenerPacienteRequest(id ?? ''), {
    deps: [pacienteVersion],
    enabled: habilitado,
  })

  const estudiosQuery = useApiQuery<PaginatedList<Estudio>>(
    listarEstudiosRequest(id ?? '', { page: 1, pageSize: 50 }),
    {
      deps: [estudiosVersion],
      enabled: habilitado,
    },
  )

  const internacionActivaQuery = useApiQuery<InternacionDetalle>(
    obtenerInternacionActivaRequest(id ?? ''),
    {
      deps: [pacienteVersion],
      enabled: habilitado,
    },
  )

  const recargarPaciente = () => setPacienteVersion((v) => v + 1)
  const recargarEstudios = () => setEstudiosVersion((v) => v + 1)

  const guardarDatos = async (
    datos: Omit<ModificarPacientePayload, 'medicoDeCabeceraId'> & {
      medicoDeCabeceraNombre: string
      factorDeRiesgoIds: number[]
    },
  ) => {
    if (!id) return
    const medicoId = datos.medicoDeCabeceraNombre.trim()
      ? await obtenerOCrearMedicoDeCabecera(datos.medicoDeCabeceraNombre.trim())
      : null

    await modificarPaciente(id, {
      nombre: datos.nombre,
      apellido: datos.apellido,
      dni: datos.dni,
      fechaNacimiento: datos.fechaNacimiento,
      sexo: datos.sexo,
      antecedentes: datos.antecedentes,
      medicoDeCabeceraId: medicoId,
    })

    await reemplazarFactoresDeRiesgo(id, datos.factorDeRiesgoIds)
    recargarPaciente()
  }

  const guardarContacto = async (contactoId: string | null, datos: ContactoInput) => {
    if (!id) return
    if (contactoId) {
      await modificarContacto(id, contactoId, datos)
    } else {
      await agregarContacto(id, datos)
    }
    recargarPaciente()
  }

  const borrarContacto = async (contactoId: string) => {
    if (!id) return
    await eliminarContacto(id, contactoId)
    recargarPaciente()
  }

  const agregarEstudio = async (datos: CrearEstudioPayload) => {
    if (!id) return
    await crearEstudio(id, datos)
    recargarEstudios()
  }

  const borrarEstudio = async (estudioId: string) => {
    if (!id) return
    await eliminarEstudio(id, estudioId)
    recargarEstudios()
  }

  return {
    paciente: pacienteQuery.data ?? null,
    cargandoInicial: pacienteQuery.cargando && pacienteQuery.data === undefined,
    actualizando: pacienteQuery.cargando && pacienteQuery.data !== undefined,
    noEncontrado: pacienteQuery.errorStatus === 404,
    errorPaciente: pacienteQuery.errorStatus === 404 ? null : pacienteQuery.error,
    estudios: estudiosQuery.data?.items ?? [],
    cargandoEstudios: estudiosQuery.cargando && estudiosQuery.data === undefined,
    errorEstudios: estudiosQuery.error,
    internacionActiva:
      internacionActivaQuery.errorStatus === 404 ? null : (internacionActivaQuery.data ?? null),
    recargarPaciente,
    recargarEstudios,
    guardarDatos,
    guardarContacto,
    borrarContacto,
    agregarEstudio,
    borrarEstudio,
  }
}
