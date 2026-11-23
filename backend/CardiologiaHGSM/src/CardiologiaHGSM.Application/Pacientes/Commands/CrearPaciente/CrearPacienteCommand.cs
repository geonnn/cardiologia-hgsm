using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearPaciente;

public sealed record CrearPacienteCommand(
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    Sexo Sexo
);
