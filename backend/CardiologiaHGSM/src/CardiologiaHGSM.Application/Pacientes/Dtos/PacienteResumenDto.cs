using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record PacienteResumenDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    DateTime FechaCarga,
    int Edad,
    Sexo Sexo,
    DateTimeOffset FechaCarga)
{
    public static PacienteResumenDto FromEntity(Paciente paciente, DateOnly hoy) => new(
        paciente.Id,
        paciente.Nombre,
        paciente.Apellido,
        paciente.Dni.Valor,
        paciente.FechaNacimiento,
        paciente.CalcularEdad(hoy),
        paciente.Sexo,
        paciente.FechaCarga
    );
}
