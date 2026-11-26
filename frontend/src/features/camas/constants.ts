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
  /** Colores invertidos (fondo = color de texto de la tarjeta), para etiquetas dentro de la tarjeta. */
  invertidoClass: string
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
    invertidoClass: 'bg-estado-ocupada-ink text-estado-ocupada',
    nota: 'Ocupada',
  },
  disponible: {
    label: 'Disponible',
    plural: 'disponibles',
    icon: CheckIcon,
    cardClass: 'bg-estado-disponible text-estado-disponible-ink',
    dotClass: 'bg-estado-disponible',
    invertidoClass: 'bg-estado-disponible-ink text-estado-disponible',
    nota: 'Lista para una nueva internación',
  },
  aislamiento: {
    label: 'En aislamiento',
    plural: 'en aislamiento',
    icon: ShieldAlertIcon,
    cardClass: 'bg-estado-aislamiento text-estado-aislamiento-ink',
    dotClass: 'bg-estado-aislamiento',
    invertidoClass: 'bg-estado-aislamiento-ink text-estado-aislamiento',
    nota: 'Bloqueada por aislamiento',
  },
  deshabilitada: {
    label: 'Deshabilitada',
    plural: 'deshabilitadas',
    icon: BanIcon,
    cardClass: 'bg-estado-deshabilitada text-estado-deshabilitada-ink',
    dotClass: 'bg-estado-deshabilitada',
    invertidoClass: 'bg-estado-deshabilitada-ink text-estado-deshabilitada',
    nota: 'Fuera de servicio',
  },
}

/** Acciones del menú según el estado actual (siguen las transiciones válidas del dominio). */
export const ACCIONES_POR_ESTADO: Record<EstadoCama, ReadonlyArray<AccionCama>> = {
  disponible: [
    { id: 'nueva-internacion', label: 'Nueva internación' },
    { id: 'bloquear', label: 'Bloquear por aislamiento', nuevoEstado: 'aislamiento', mensaje: 'bloqueada' },
    { id: 'deshabilitar', label: 'Deshabilitar cama', nuevoEstado: 'deshabilitada', mensaje: 'deshabilitada' },
  ],
  ocupada: [
    { id: 'ver-ficha', label: 'Ver ficha del paciente' },
    { id: 'fin-internacion', label: 'Registrar fin de internación' },
  ],
  aislamiento: [{ id: 'desbloquear', label: 'Desbloquear cama', nuevoEstado: 'disponible', mensaje: 'desbloqueada' }],
  deshabilitada: [{ id: 'habilitar', label: 'Habilitar cama', nuevoEstado: 'disponible', mensaje: 'habilitada' }],
}
