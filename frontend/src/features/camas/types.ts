import type { AccionEstadoApi } from './api/camasApi'

/** Espeja el enum `Manejo` del dominio (backend). */
export type Sector = 'UCO' | 'Sala'

/** Espeja los estados de `Cama.EstadoCama` del dominio (backend). */
export type EstadoCama = 'ocupada' | 'disponible' | 'aislamiento' | 'deshabilitada'

/** Espeja el enum `Sexo` del dominio (backend). */
export type Sexo = 'Masculino' | 'Femenino'

/** Paciente que ocupa la cama (OcupanteCamaDto del backend). */
export interface PacienteInternado {
  internacionId: string
  pacienteId: string
  nombreCompleto: string
  edad: number
  sexo: Sexo
  motivosInternacion: string[]
  /** Días desde la fecha de internación (0 = ingresó hoy). */
  diasInternado: number
}

export interface Cama {
  id: string
  numero: number
  sector: Sector
  estado: EstadoCama
  paciente?: PacienteInternado
}

export type FiltroEstado = EstadoCama | 'todos'

/** Datos para crear una cama (RF-10). La cama se crea siempre en estado "disponible". */
export interface NuevaCama {
  numero: number
  sector: Sector
}

/** Acción disponible en el menú de una cama. Si tiene `accionApi`, cambia el estado de la cama en el backend. */
export interface AccionCama {
  id: string
  label: string
  accionApi?: AccionEstadoApi
  /** Participio para el mensaje de confirmación: "Cama 3 de UCO <mensaje>". */
  mensaje?: string
  tone?: 'default' | 'danger'
}
