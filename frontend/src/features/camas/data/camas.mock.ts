// Datos de prueba hasta que exista el endpoint de camas en la API.
import { haceDias } from '@/lib/fechas'
import type { Cama, EstadoCama, PacienteInternado, Sector, Sexo } from '../types'

const paciente = (
  nombre: string,
  edad: number,
  sexo: Sexo,
  diasInternado: number,
  motivoInternacion: string,
  aislamiento?: string,
): PacienteInternado => ({ nombre, edad, sexo, fechaIngreso: haceDias(diasInternado), motivoInternacion, aislamiento })

const cama = (sector: Sector, numero: number, estado: EstadoCama, p?: PacienteInternado): Cama => ({
  id: `${sector}-${numero}`,
  sector,
  numero,
  estado,
  paciente: p,
})

export const camasMock: Cama[] = [
  cama('UCO', 1, 'ocupada', paciente('María Pérez', 67, 'Femenino', 7, 'Infarto agudo de miocardio', 'Contacto')),
  cama('UCO', 2, 'ocupada', paciente('Jorge Benítez', 72, 'Masculino', 2, 'Taquicardia ventricular')),
  cama('UCO', 3, 'disponible'),
  cama('UCO', 4, 'ocupada', paciente('Lucía Fernández', 58, 'Femenino', 0, 'Síndrome coronario agudo')),
  cama('UCO', 5, 'aislamiento'),
  cama('UCO', 6, 'disponible'),
  cama('UCO', 7, 'deshabilitada'),
  cama('UCO', 8, 'ocupada', paciente('Raúl Domínguez', 81, 'Masculino', 12, 'Insuficiencia cardíaca descompensada', 'Contacto')),
  cama('Sala', 1, 'ocupada', paciente('Carmen Sosa', 74, 'Femenino', 5, 'Fibrilación auricular')),
  cama('Sala', 2, 'ocupada', paciente('Héctor Ramírez', 63, 'Masculino', 9, 'Angina inestable')),
  cama('Sala', 3, 'disponible'),
  cama('Sala', 4, 'ocupada', paciente('Ana Gómez', 55, 'Femenino', 1, 'Síncope en estudio')),
  cama('Sala', 5, 'ocupada', paciente('Luis Acosta', 69, 'Masculino', 14, 'Endocarditis infecciosa', 'Gotas')),
  cama('Sala', 6, 'aislamiento'),
  cama('Sala', 7, 'disponible'),
  cama('Sala', 8, 'ocupada', paciente('Rosa Medina', 78, 'Femenino', 3, 'Insuficiencia cardíaca')),
  cama('Sala', 9, 'ocupada', paciente('Pablo Ibáñez', 61, 'Masculino', 6, 'Hipertensión pulmonar')),
  cama('Sala', 10, 'deshabilitada'),
  cama('Sala', 11, 'disponible'),
  cama('Sala', 12, 'ocupada', paciente('Elena Ruiz', 70, 'Femenino', 4, 'Miocardiopatía dilatada')),
]
