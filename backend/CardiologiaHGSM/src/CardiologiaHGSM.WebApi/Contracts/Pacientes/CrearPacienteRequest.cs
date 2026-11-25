using System.ComponentModel.DataAnnotations;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.WebApi.Contracts.Pacientes;

// FechaNacimiento y Sexo son nullable + [Required] para que si faltan en el body se devuelva 400
// en vez de tomar valores por defecto (0001-01-01 o Sexo.Masculino).
public sealed record CrearPacienteRequest(
    [Required] string Nombre,
    [Required] string Apellido,
    [Required] string Dni,
    [Required] DateOnly? FechaNacimiento,
    [Required] Sexo? Sexo,
    string? Antecedentes = null,
    Guid? MedicoDeCabeceraId = null,
    IReadOnlyCollection<int>? FactorDeRiesgoIds = null,
    IReadOnlyCollection<AgregarContactoRequest>? Contactos = null
);
