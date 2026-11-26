import { BanIcon, CheckIcon, ShieldAlertIcon, UserIcon, type LucideIcon } from 'lucide-react'
import type { AccionCama, EstadoCama, Sector } from './types'

export const SECTORES: ReadonlyArray<Sector> = ['UCO', 'Sala']

/** Orden en que se muestran los estados (filtros y orden de la grilla). */
export const ESTADOS: ReadonlyArray<EstadoCama> = ['ocupada', 'disponible', 'aislamiento', 'deshabilitada']

interface EstadoConfig {
  label: string
  /** Para "No hay camas <plural> en UCO". */
  plural: string
  icon: LucideIcon
  /** Clases de Tailwind (colores definidos en index.css). Deben ser literales para que Tailwind las detecte. */
  cardClass: string
  dotClass: string
  /** Texto que se muestra en la tarjeta cuando no hay paciente. */
  nota: string
}

export const ESTADO_CONFIG: Record<EstadoCama, EstadoConfig> = {
  ocupada: {
    label: 'Ocupada',
    plural: 'ocupadas',
    icon: UserIcon,
    cardClass: 'bg-estado-ocupada text-estado-ocupada-ink',
    dotClass: 'bg-estado-ocupada',
    nota: 'Ocupada',
  },
  disponible: {
    label: 'Disponible',
    plural: 'disponibles',
    icon: CheckIcon,
    cardClass: 'bg-estado-disponible text-estado-disponible-ink',
    dotClass: 'bg-estado-disponible',
    nota: 'Lista para una nueva internación',
  },
  aislamiento: {
    label: 'En aislamiento',
    plural: 'en aislamiento',
    icon: ShieldAlertIcon,
    cardClass: 'bg-estado-aislamiento text-estado-aislamiento-ink',
    dotClass: 'bg-estado-aislamiento',
    nota: 'Bloqueada por aislamiento',
  },
  deshabilitada: {
    label: 'Deshabilitada',
    plural: 'deshabilitadas',
    icon: BanIcon,
    cardClass: 'bg-estado-deshabilitada text-estado-deshabilitada-ink',
    dotClass: 'bg-estado-deshabilitada',
    nota: 'Fuera de servicio',
  },
}

/** Acciones del menú según el estado actual (siguen las transiciones válidas del dominio). */
export const ACCIONES_POR_ESTADO: Record<EstadoCama, ReadonlyArray<AccionCama>> = {
  disponible: [
    { id: 'nueva-internacion', label: 'Nueva internación' },
    { id: 'bloquear', label: 'Bloquear por aislamiento', accionApi: 'bloquear', mensaje: 'bloqueada' }, // RF-27
    { id: 'deshabilitar', label: 'Deshabilitar cama', accionApi: 'deshabilitar', mensaje: 'deshabilitada' }, // RF-29
  ],
  ocupada: [
    { id: 'ver-ficha', label: 'Ver ficha del paciente' },
    { id: 'fin-internacion', label: 'Registrar fin de internación' },
  ],
  aislamiento: [{ id: 'desbloquear', label: 'Desbloquear cama', accionApi: 'desbloquear', mensaje: 'desbloqueada' }], // RF-28
  deshabilitada: [{ id: 'habilitar', label: 'Habilitar cama', accionApi: 'habilitar', mensaje: 'habilitada' }], // RF-30
}
