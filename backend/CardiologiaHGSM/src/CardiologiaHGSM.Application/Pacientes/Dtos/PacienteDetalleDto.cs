using CardiologiaHGSM.Application.Catalogos.Dtos;
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
    string? Antecedentes,
    DateTime FechaCarga,
    MedicoDeCabeceraDto? MedicoDeCabecera,
    IReadOnlyList<ContactoDto> Contactos,
    IReadOnlyList<FactorDeRiesgoDto> FactoresDeRiesgo)
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
        paciente.FechaCarga,
        paciente.MedicoDeCabecera is not null
            ? MedicoDeCabeceraDto.FromEntity(paciente.MedicoDeCabecera)
            : null,
        paciente.Contactos.Select(ContactoDto.FromEntity).ToList(),
        paciente.FactoresDeRiesgo.Select(FactorDeRiesgoDto.FromEntity).ToList()
    );
}
