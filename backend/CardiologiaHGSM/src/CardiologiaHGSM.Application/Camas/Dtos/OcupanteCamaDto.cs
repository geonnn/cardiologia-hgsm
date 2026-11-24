using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Camas.Dtos;

public sealed record OcupanteCamaDto(
    Guid InternacionId,
    Guid PacienteId,
    string Nombre,
    string Apellido,
    int Edad,
    Sexo Sexo,
    IReadOnlyList<string> MotivosInternacion,
    int DiasInternado)
{
    public static OcupanteCamaDto FromEntity(Internacion internacion, DateTime ahoraUtc)
    {
        var paciente = internacion.Paciente;

        return new OcupanteCamaDto(
            internacion.Id,
            paciente.Id,
            paciente.Nombre,
            paciente.Apellido,
            paciente.CalcularEdad(DateOnly.FromDateTime(ahoraUtc)),
            paciente.Sexo,
            internacion.MotivosInternacion.Select(m => m.Nombre).ToList(),
            Math.Max(0, (ahoraUtc.Date - internacion.FechaInternacion.Date).Days));
    }
}
