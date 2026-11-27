import type { CondicionAlta, Manejo } from './api/internacionesApi'

/** Longitud máxima alineada con `Internacion.MaxLongitudAislamiento` en el dominio. */
export const MAX_LONGITUD_AISLAMIENTO = 50

/** Longitud máxima alineada con `Pendiente.MaxLongitudTitulo` en el dominio. */
export const MAX_LONGITUD_TITULO_PENDIENTE = 32

/** Ventana máxima de ± meses alineada con `Tratamiento.MaxMesesDesfasaje` en el dominio. */
export const MAX_MESES_DESFASAJE_TRATAMIENTO = 2

export const MANEJOS: ReadonlyArray<Manejo> = ['UCO', 'Sala']

export interface CondicionAltaConfig {
  value: CondicionAlta
  label: string
  badgeClass: string
}

export const CONDICIONES_ALTA: ReadonlyArray<CondicionAltaConfig> = [
  {
    value: 'AltaHospitalaria',
    label: 'Alta hospitalaria',
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  {
    value: 'Traslado',
    label: 'Traslado',
    badgeClass: 'bg-sky-100 text-sky-800',
  },
  {
    value: 'RetiroVoluntario',
    label: 'Retiro voluntario',
    badgeClass: 'bg-amber-100 text-amber-800',
  },
  {
    value: 'Obito',
    label: 'Óbito',
    badgeClass: 'bg-zinc-200 text-zinc-800',
  },
]

export const CONDICION_ALTA_POR_VALOR: Record<CondicionAlta, CondicionAltaConfig> = {
  AltaHospitalaria: CONDICIONES_ALTA[0],
  Traslado: CONDICIONES_ALTA[1],
  RetiroVoluntario: CONDICIONES_ALTA[2],
  Obito: CONDICIONES_ALTA[3],
}
