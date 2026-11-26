/** Espeja el enum `Manejo` del dominio (backend). */
export type Sector = 'UCO' | 'Sala'

/** Espeja los estados de `Cama.EstadoCama` del dominio (backend). */
export type EstadoCama = 'ocupada' | 'disponible' | 'aislamiento' | 'deshabilitada'

/** Espeja el enum `Sexo` del dominio (backend). */
export type Sexo = 'Masculino' | 'Femenino'

export interface PacienteInternado {
  nombre: string
  edad: number
  sexo: Sexo
  /** Fecha ISO de ingreso. */
  fechaIngreso: string
  motivoInternacion: string
  /** Tipo de aislamiento (ej. "Contacto", "Gotas"), si corresponde. */
  aislamiento?: string
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

/** Acción disponible en el menú de una cama. Si tiene `nuevoEstado`, cambia el estado de la cama. */
export interface AccionCama {
  id: string
  label: string
  nuevoEstado?: EstadoCama
  /** Participio para el mensaje de confirmación: "Cama 3 de UCO <mensaje>". */
  mensaje?: string
  tone?: 'default' | 'danger'
}
