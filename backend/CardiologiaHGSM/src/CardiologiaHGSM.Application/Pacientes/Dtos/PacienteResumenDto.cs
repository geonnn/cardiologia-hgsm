using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record PacienteResumenDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    int Edad,
    Sexo Sexo,
    DateTime FechaCarga)
{
    public static PacienteResumenDto FromEntity(Paciente paciente) => new(
        paciente.Id,
        paciente.Nombre,
        paciente.Apellido,
        paciente.Dni.Valor,
        paciente.FechaNacimiento,
        paciente.CalcularEdad(),
        paciente.Sexo,
        paciente.FechaCarga
    );
}
