export {
  listarFactoresDeRiesgoRequest,
  listarMedicosDeCabeceraRequest,
  obtenerOCrearMedicoDeCabecera,
  type FactorDeRiesgo,
  type MedicoDeCabecera,
} from './api/catalogosApi'
export {
  crearPaciente,
  listarPacientesRequest,
  type ContactoInput,
  type PacienteResumen,
  type PaginatedList,
  type Sexo,
} from './api/pacientesApi'
export { FactoresRiesgoCombobox } from './components/FactoresRiesgoCombobox'
export { DetallePacientePage } from './pages/DetallePacientePage'
export { NuevoPacientePage } from './pages/NuevoPacientePage'
export { PacientesPage } from './pages/PacientesPage'
export {
  MAX_LONGITUD_APELLIDO,
  MAX_LONGITUD_DNI,
  MAX_LONGITUD_MEDICO,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_PARENTESCO,
  MAX_LONGITUD_TELEFONO,
  MIN_LONGITUD_DNI,
  validarContacto,
  validarDatosPaciente,
  type ErroresContacto,
  type ErroresPaciente,
} from './validaciones'
