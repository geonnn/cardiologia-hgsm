/**
 * Tipos y contratos para el módulo de Pacientes y Estudios
 */

export type Sexo = 'Masculino' | 'Femenino';

export interface Contacto {
  id?: string;
  nombre: string;
  apellido?: string | null;
  telefono: string;
  parentesco?: string | null;
}

export interface FactorDeRiesgo {
  id: number;
  nombre: string;
}

export interface MotivoInternacion {
  id: number;
  nombre: string;
}

export interface MedicoDeCabecera {
  id: string;
  nombre: string;
}

export interface TipoEstudio {
  id: number;
  nombre: string;
}

/** Resumen para el listado de pacientes */
export interface PacienteResumen {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento?: string;
  edad: number;
  sexo: Sexo;
  fechaCarga?: string; // Fecha de registro en el sistema
}

/** Detalle completo para la Ficha Clínica del paciente */
export interface PacienteDetalle {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  edad: number;
  sexo: Sexo;
  antecedentes?: string | null;
  fechaCarga: string;
  medicoDeCabecera?: MedicoDeCabecera | null;
  contactos: Contacto[];
  factoresDeRiesgo: FactorDeRiesgo[];
}

/** Datos para dar de alta un paciente (POST /api/pacientes) */
export interface CrearPacientePayload {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string; // "YYYY-MM-DD"
  sexo: Sexo;
  antecedentes?: string | null;
  medicoDeCabeceraId?: string | null;
  contactos?: Omit<Contacto, 'id'>[];
  factoresDeRiesgoIds?: number[];
}

/** Filtros de búsqueda para el listado (GET /api/pacientes) */
export interface ListarPacientesParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  sexo?: Sexo;
  factorDeRiesgoId?: number;
  motivoInternacionId?: number;
  medicoDeCabeceraId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

/** Respuesta paginada estándar del backend */
export interface PaginatedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Estudio médico complementario del paciente */
export interface Estudio {
  id: string;
  pacienteId: string;
  tipoEstudio: TipoEstudio;
  titulo: string;
  fecha: string;
  descripcion: string;
}

export interface CrearEstudioPayload {
  tipoEstudioId: number;
  titulo: string;
  fecha: string;
  descripcion: string;
}
