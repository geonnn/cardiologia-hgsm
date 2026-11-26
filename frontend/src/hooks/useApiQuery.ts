import { useEffect, useState, type DependencyList } from 'react'
import axios, { type AxiosRequestConfig } from 'axios'
import { api, mensajeDeError } from '@/lib/api'

export interface ApiQueryState<T> {
  data: T | undefined
  /** Mensaje de error listo para mostrar, o null. */
  error: string | null
  /** Código HTTP del último error (ej. 404), o null si no hubo error HTTP. */
  errorStatus: number | null
  cargando: boolean
}

interface ApiQueryOptions<TResponse, TData> {
  /** Transforma la respuesta (ej. DTO del backend → modelo del front). */
  select?: (data: TResponse) => TData
  /** Dependencias extra que fuerzan una nueva consulta (ej. un contador para recargar). */
  deps?: DependencyList
  /** Si es `false`, no dispara el pedido HTTP. Por defecto `true`. */
  enabled?: boolean
}

/**
 * Hace un pedido con axios (`api.request`) al montar y cada vez que cambian
 * el método, la URL o los parámetros del pedido, o `options.deps`.
 * Cancela el pedido anterior con AbortController para evitar respuestas fuera de orden
 * y, mientras recarga, conserva el último `data` para no hacer parpadear la UI.
 *
 * @example
 * const { data, cargando, error } = useApiQuery<CamaDto[], Cama[]>(
 *   { url: '/camas', params: { sector: 'UCO' } },
 *   { select: (dtos) => dtos.map(aCama) },
 * )
 */
export function useApiQuery<TResponse, TData = TResponse>(
  request: AxiosRequestConfig,
  { select, deps = [], enabled = true }: ApiQueryOptions<TResponse, TData> = {},
): ApiQueryState<TData> {
  const [state, setState] = useState<ApiQueryState<TData>>({
    data: undefined,
    error: null,
    errorStatus: null,
    cargando: enabled,
  })

  // Clave estable del pedido: un objeto nuevo con los mismos valores no vuelve a consultar
  const clave = JSON.stringify([request.method ?? 'get', request.url, request.params])

  useEffect(() => {
    if (!enabled) {
      setState((prev) => (prev.cargando ? { ...prev, cargando: false } : prev))
      return
    }

    const controller = new AbortController()
    setState((prev) => ({ ...prev, cargando: true, error: null, errorStatus: null }))

    api
      .request<TResponse>({ ...request, signal: controller.signal })
      .then(({ data }) =>
        setState({
          data: select ? select(data) : (data as unknown as TData),
          error: null,
          errorStatus: null,
          cargando: false,
        }),
      )
      .catch((error: unknown) => {
        if (axios.isCancel(error) || controller.signal.aborted) return
        const errorStatus = axios.isAxiosError(error) ? (error.response?.status ?? null) : null
        setState((prev) => ({
          ...prev,
          error: mensajeDeError(error),
          errorStatus,
          cargando: false,
        }))
      })

    return () => controller.abort()
    // `request` y `select` se recrean en cada render: lo que define el pedido está en `clave`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, enabled, ...deps])

  return state
}
