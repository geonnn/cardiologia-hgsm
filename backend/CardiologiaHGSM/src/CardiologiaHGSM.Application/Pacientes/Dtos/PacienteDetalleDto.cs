using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record PacienteDetalleDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    Sexo Sexo)
{
    public static PacienteDetalleDto FromEntity(Paciente paciente) => new(
        paciente.Id,
        paciente.Nombre,
        paciente.Apellido,
        paciente.Dni.Valor,
        paciente.FechaNacimiento,
        paciente.Sexo
    );
}
