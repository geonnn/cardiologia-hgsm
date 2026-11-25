import type { FactorDeRiesgo, MedicoDeCabecera, MotivoInternacion, TipoEstudio } from '../types/paciente';

// Valores por defecto habituales en cardiología si la API o base de datos no está levantada
const FACTORES_DEFAULT: FactorDeRiesgo[] = [
  { id: 1, nombre: 'Hipertensión Arterial (HTA)' },
  { id: 2, nombre: 'Diabetes Mellitus' },
  { id: 3, nombre: 'Tabaquismo' },
  { id: 4, nombre: 'Dislipidemia' },
  { id: 5, nombre: 'Sedentarismo' },
  { id: 6, nombre: 'Obesidad' },
  { id: 7, nombre: 'Antecedentes Familiares de Enf. Coronaria' },
];

const MOTIVOS_DEFAULT: MotivoInternacion[] = [
  { id: 1, nombre: 'Síndrome Coronario Agudo (SCA)' },
  { id: 2, nombre: 'Infarto Agudo de Miocardio (IAM)' },
  { id: 3, nombre: 'Insuficiencia Cardíaca Descompensada' },
  { id: 4, nombre: 'Fibrilación Auricular con RVR' },
  { id: 5, nombre: 'Bloqueo AV Completo' },
  { id: 6, nombre: 'Síncope en Estudio' },
  { id: 7, nombre: 'Estenosis Aórtica Severa' },
  { id: 8, nombre: 'Endocarditis Infecciosa' },
];

const TIPOS_ESTUDIO_DEFAULT: TipoEstudio[] = [
  { id: 1, nombre: 'Ecocardiograma Transtorácico (ETT)' },
  { id: 2, nombre: 'Electrocardiograma (ECG)' },
  { id: 3, nombre: 'Prueba Ergométrica Graduada (PEG)' },
  { id: 4, nombre: 'Holter de 24 Horas' },
  { id: 5, nombre: 'Cinecoronariografía (CCG)' },
  { id: 6, nombre: 'Angiotomografía Coronaria' },
  { id: 7, nombre: 'Resonancia Magnética Cardíaca' },
];

export async function listarFactoresDeRiesgo(): Promise<FactorDeRiesgo[]> {
  try {
    const res = await fetch('/api/factores-de-riesgo');
    if (!res.ok) throw new Error('Error al obtener factores de riesgo');
    return await res.json();
  } catch {
    return FACTORES_DEFAULT;
  }
}

export async function listarMotivosInternacion(): Promise<MotivoInternacion[]> {
  try {
    const res = await fetch('/api/motivos-internacion');
    if (!res.ok) throw new Error('Error al obtener motivos de internación');
    return await res.json();
  } catch {
    return MOTIVOS_DEFAULT;
  }
}

export async function listarTiposEstudio(): Promise<TipoEstudio[]> {
  try {
    const res = await fetch('/api/tipos-estudio');
    if (!res.ok) throw new Error('Error al obtener tipos de estudio');
    return await res.json();
  } catch {
    return TIPOS_ESTUDIO_DEFAULT;
  }
}

export async function listarMedicosDeCabecera(): Promise<MedicoDeCabecera[]> {
  try {
    const res = await fetch('/api/medicos-de-cabecera');
    if (!res.ok) throw new Error('Error al obtener médicos de cabecera');
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Busca si existe un médico de cabecera por nombre o lo crea en el catálogo para obtener su ID
 */
export async function obtenerOCrearMedicoDeCabecera(nombre: string): Promise<string | null> {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) return null;

  try {
    const medicos = await listarMedicosDeCabecera();
    const existente = medicos.find((m) => m.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (existente) return existente.id;

    // Si no existe, crearlo
    const res = await fetch('/api/medicos-de-cabecera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreLimpio }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
  } catch {
    // Si no hay conexión con el backend
  }
  return null;
}
