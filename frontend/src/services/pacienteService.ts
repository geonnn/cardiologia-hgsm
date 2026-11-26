import type {
  PacienteResumen,
  PacienteDetalle,
  CrearPacientePayload,
  ListarPacientesParams,
  PaginatedList,
  Contacto,
  Estudio,
  CrearEstudioPayload,
} from '../types/paciente';

const BASE_URL = '/api/pacientes';

/**
 * Helper para manejar respuestas HTTP y extraer errores de validación de ProblemDetails (.NET)
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        if (firstErrorKey && errorData.errors[firstErrorKey].length > 0) {
          errorMessage = errorData.errors[firstErrorKey][0];
        }
      }
    } catch {
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Obtiene el listado paginado de pacientes con filtros opcionales
 */
export async function listarPacientes(
  params?: ListarPacientesParams
): Promise<PaginatedList<PacienteResumen>> {
  const query = new URLSearchParams();

  if (params?.page) query.append('page', params.page.toString());
  if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
  if (params?.busqueda?.trim()) query.append('busqueda', params.busqueda.trim());
  if (params?.sexo) query.append('sexo', params.sexo);
  if (params?.factorDeRiesgoId) query.append('factorDeRiesgoId', params.factorDeRiesgoId.toString());
  if (params?.motivoInternacionId) query.append('motivoInternacionId', params.motivoInternacionId.toString());
  if (params?.medicoDeCabeceraId) query.append('medicoDeCabeceraId', params.medicoDeCabeceraId);
  if (params?.fechaDesde) query.append('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) query.append('fechaHasta', params.fechaHasta);

  const url = query.toString() ? `${BASE_URL}?${query.toString()}` : BASE_URL;
  const res = await fetch(url);
  return handleResponse<PaginatedList<PacienteResumen>>(res);
}

/**
 * Obtiene el detalle completo de un paciente por su ID
 */
export async function obtenerPacientePorId(id: string): Promise<PacienteDetalle> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<PacienteDetalle>(res);
}

/**
 * Obtiene el detalle de un paciente por su DNI
 */
export async function obtenerPacientePorDni(dni: string): Promise<PacienteDetalle> {
  const res = await fetch(`${BASE_URL}/dni/${encodeURIComponent(dni)}`);
  return handleResponse<PacienteDetalle>(res);
}

/**
 * Da de alta un nuevo paciente
 */
export async function crearPaciente(
  data: CrearPacientePayload
): Promise<{ id: string }> {
  // 1. Crear paciente principal
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      fechaNacimiento: data.fechaNacimiento,
      sexo: data.sexo,
      antecedentes: data.antecedentes || null,
      medicoDeCabeceraId: data.medicoDeCabeceraId || null,
    }),
  });

  const nuevo = await handleResponse<{ id: string }>(res);
  const pacienteId = nuevo.id;

  // 2. Si se ingresaron contactos, agregarlos
  if (data.contactos && data.contactos.length > 0) {
    for (const contacto of data.contactos) {
      await agregarContacto(pacienteId, contacto);
    }
  }

  // 3. Si se seleccionaron factores de riesgo, vincularlos
  if (data.factoresDeRiesgoIds && data.factoresDeRiesgoIds.length > 0) {
    await reemplazarFactoresDeRiesgo(pacienteId, data.factoresDeRiesgoIds);
  }

  return nuevo;
}

/**
 * Modifica los datos personales de un paciente
 */
export async function modificarPaciente(
  id: string,
  data: Partial<CrearPacientePayload>
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<void>(res);
}

/**
 * Agrega un contacto al paciente
 */
export async function agregarContacto(
  pacienteId: string,
  contacto: Omit<Contacto, 'id'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/${pacienteId}/contactos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contacto),
  });
  return handleResponse<{ id: string }>(res);
}

/**
 * Elimina un contacto del paciente
 */
export async function eliminarContacto(
  pacienteId: string,
  contactoId: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${pacienteId}/contactos/${contactoId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

/**
 * Asigna los factores de riesgo del paciente (reemplaza los existentes)
 */
export async function reemplazarFactoresDeRiesgo(
  pacienteId: string,
  factorDeRiesgoIds: number[]
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${pacienteId}/factores-de-riesgo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ factorDeRiesgoIds }),
  });
  return handleResponse<void>(res);
}

/**
 * Lista los estudios médicos de un paciente
 */
export async function listarEstudios(
  pacienteId: string,
  params?: { page?: number; pageSize?: number; tipoEstudioId?: number }
): Promise<PaginatedList<Estudio>> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
  if (params?.tipoEstudioId) query.append('tipoEstudioId', params.tipoEstudioId.toString());

  const url = `${BASE_URL}/${pacienteId}/estudios?${query.toString()}`;
  const res = await fetch(url);
  return handleResponse<PaginatedList<Estudio>>(res);
}

/**
 * Agrega un nuevo estudio al paciente
 */
export async function crearEstudio(
  pacienteId: string,
  data: CrearEstudioPayload
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/${pacienteId}/estudios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ id: string }>(res);
}

/**
 * Elimina un estudio del paciente
 */
export async function eliminarEstudio(
  pacienteId: string,
  estudioId: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${pacienteId}/estudios/${estudioId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}
