using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearPaciente;

public sealed record CrearContactoInput(
    string Nombre,
    string Telefono,
    string? Apellido = null,
    string? Parentesco = null
);

public sealed record CrearPacienteCommand(
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    Sexo Sexo,
    string? Antecedentes = null,
    Guid? MedicoDeCabeceraId = null,
    IReadOnlyCollection<int>? FactorDeRiesgoIds = null,
    IReadOnlyCollection<CrearContactoInput>? Contactos = null
);
