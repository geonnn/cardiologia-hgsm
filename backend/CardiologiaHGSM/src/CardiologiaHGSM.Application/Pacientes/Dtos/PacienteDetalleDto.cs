using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes.Dtos;

public sealed record PacienteDetalleDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    DateOnly FechaNacimiento,
    int Edad,
    Sexo Sexo,
    string? Antecedentes = null,
    string? MedicoDeCabecera = null)
{
    public static PacienteDetalleDto FromEntity(Paciente paciente) => new(
        paciente.Id,
        paciente.Nombre,
        paciente.Apellido,
        paciente.Dni.Valor,
        paciente.FechaNacimiento,
        paciente.CalcularEdad(),
        paciente.Sexo,
        paciente.Antecedentes,
        paciente.MedicoDeCabecera?.Nombre
    );
}
