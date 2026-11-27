using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record InternacionPacienteDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Dni,
    int Edad,
    Sexo Sexo)
{
    public static InternacionPacienteDto FromEntity(Paciente paciente, DateOnly hoy) => new(
        paciente.Id,
        paciente.Nombre,
        paciente.Apellido,
        paciente.Dni.Valor,
        paciente.CalcularEdad(hoy),
        paciente.Sexo);
}
