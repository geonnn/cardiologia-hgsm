using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Pacientes.Commands.ModificarPaciente;

public sealed record ModificarPacienteCommand(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    Sexo Sexo,
    string? Antecedentes = null,
    Guid? MedicoDeCabeceraId = null
);
