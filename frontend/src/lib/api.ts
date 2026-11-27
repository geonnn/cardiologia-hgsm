import axios from 'axios'

/**
 * Cliente HTTP de la WebApi. En desarrollo, Vite redirige `/api` a la API
 * (ver `server.proxy` en vite.config.ts). Se puede sobrescribir con VITE_API_URL.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

/** Respuesta de error de la API (ProblemDetails, RFC 7807) generada por ApiControllerBase. */
export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  /** Código del error de dominio, ej. "Cama.NumeroDuplicado" (errores no de validación). */
  code?: string
  /** Errores de validación: clave = código del error o nombre del campo. */
  errors?: Record<string, string[]>
}

const problemaDe = (error: unknown): ProblemDetails | undefined => {
  if (!axios.isAxiosError(error)) return undefined
  const data = error.response?.data
  return typeof data === 'object' && data !== null ? (data as ProblemDetails) : undefined
}

const MENSAJE_POR_STATUS: Record<number, string> = {
  502: 'El servidor no está disponible en este momento. Intentá nuevamente en unos segundos.',
  503: 'El servidor no está disponible en este momento. Intentá nuevamente en unos segundos.',
  504: 'El servidor tardó demasiado en responder. Intentá nuevamente.',
  500: 'Ocurrió un error interno en el servidor.',
}

/** Mensaje legible para mostrar al usuario a partir de cualquier error de la API. */
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor.'
    const problema = problemaDe(error)
    const primerErrorDeValidacion = problema?.errors ? Object.values(problema.errors).flat()[0] : undefined
    return (
      primerErrorDeValidacion ??
      problema?.detail ??
      problema?.title ??
      MENSAJE_POR_STATUS[error.response.status] ??
      `Error inesperado (${error.response.status}).`
    )
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

/** Códigos de error de dominio presentes en la respuesta (ej. ["Cama.NumeroDuplicado"]). */
export function codigosDeError(error: unknown): string[] {
  const problema = problemaDe(error)
  if (!problema) return []
  return [...(problema.code ? [problema.code] : []), ...Object.keys(problema.errors ?? {})]
}
