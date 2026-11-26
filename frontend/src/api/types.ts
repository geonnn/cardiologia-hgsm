/**
 * Alias de tipos generados desde OpenAPI (`./schema.d.ts`).
 * Usar este archivo para tipar requests y responses de `axios` sin duplicar DTOs del backend.
 */
import type { components } from './schema'

type Schemas = components['schemas']

// ---- Enums ----

export type Sexo = Schemas['Sexo']
export type Manejo = NonNullable<Schemas['Manejo']>
export type EstadoCamaTipo = NonNullable<Schemas['EstadoCamaTipo']>
export type PacienteOrden = Schemas['PacienteOrden']

// ---- Pacientes y Estudios ----

export type PacienteResumenDto = Schemas['PacienteResumenDto']
export type PacienteDetalleDto = Schemas['PacienteDetalleDto']
export type ContactoDto = Schemas['ContactoDto']
export type EstudioDto = Schemas['EstudioDto']

export type CrearPacienteRequest = Schemas['CrearPacienteRequest']
export type ModificarPacienteRequest = Schemas['ModificarPacienteRequest']
export type AgregarContactoRequest = Schemas['AgregarContactoRequest']
export type ModificarContactoRequest = Schemas['ModificarContactoRequest']
export type ReemplazarFactoresDeRiesgoRequest = Schemas['ReemplazarFactoresDeRiesgoRequest']
export type CrearEstudioRequest = Schemas['CrearEstudioRequest']

export type PaginatedListOfPacienteResumenDto = Schemas['PaginatedListOfPacienteResumenDto']
export type PaginatedListOfEstudioDto = Schemas['PaginatedListOfEstudioDto']

// ---- Camas ----

export type CamaDto = Omit<Schemas['CamaDto'], 'sector'> & { sector: Manejo }
export type OcupanteCamaDto = Schemas['OcupanteCamaDto']
export type CrearCamaRequest = Schemas['CrearCamaRequest']

// ---- Catálogos ----

export type CatalogoNombreRequest = Schemas['CatalogoNombreRequest']
export type FactorDeRiesgoDto = Schemas['FactorDeRiesgoDto']
export type MedicoDeCabeceraDto = Schemas['MedicoDeCabeceraDto']
export type MotivoInternacionDto = Schemas['MotivoInternacionDto']
export type ObraSocialDto = Schemas['ObraSocialDto']
export type TipoEstudioDto = Schemas['TipoEstudioDto']

// ---- Pendientes ----

export type PendienteDto = Schemas['PendienteDto']
export type AgregarPendienteRequest = Schemas['AgregarPendienteRequest']
export type PaginatedListOfPendienteDto = Schemas['PaginatedListOfPendienteDto']
