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
    public static OcupanteCamaDto FromEntity(Internacion internacion, DateOnly hoy)
    {
        var paciente = internacion.Paciente;
        var fechaIngreso = DateOnly.FromDateTime(internacion.FechaInternacion.ToLocalTime().DateTime);

        return new OcupanteCamaDto(
            internacion.Id,
            paciente.Id,
            paciente.Nombre,
            paciente.Apellido,
            paciente.CalcularEdad(hoy),
            paciente.Sexo,
            internacion.MotivosInternacion.Select(m => m.Nombre).ToList(),
            Math.Max(0, hoy.DayNumber - fechaIngreso.DayNumber));
    }
}
