import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import {
  modificarInternacion,
  obtenerInternacionRequest,
  registrarAlta,
  type InternacionDetalle,
  type ModificarInternacionPayload,
  type RegistrarAltaPayload,
} from '../api/internacionesApi'

/** Estado de una internación individual: lectura, modificación/swap (RF-49) y alta (RF-50). */
export function useInternacionDetalle(id: string | undefined) {
  const [version, setVersion] = useState(0)

  const query = useApiQuery<InternacionDetalle>(obtenerInternacionRequest(id ?? ''), {
    deps: [version],
    enabled: Boolean(id),
  })

  const recargar = () => setVersion((v) => v + 1)

  const modificar = async (payload: ModificarInternacionPayload) => {
    if (!id) return
    await modificarInternacion(id, payload)
    recargar()
  }

  const darAlta = async (payload: RegistrarAltaPayload) => {
    if (!id) return
    await registrarAlta(id, payload)
    recargar()
  }

  return {
    internacion: query.data ?? null,
    cargandoInicial: query.cargando && query.data === undefined,
    actualizando: query.cargando && query.data !== undefined,
    noEncontrado: query.errorStatus === 404,
    error: query.errorStatus === 404 ? null : query.error,
    recargar,
    modificar,
    darAlta,
  }
}
