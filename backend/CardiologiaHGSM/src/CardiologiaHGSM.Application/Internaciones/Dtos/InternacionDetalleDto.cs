using CardiologiaHGSM.Application.Catalogos.Dtos;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record InternacionDetalleDto(
    Guid Id,
    DateTimeOffset FechaInternacion,
    DateTimeOffset? FechaFin,
    CondicionAlta? CondicionAlta,
    bool EstaActiva,
    Manejo Manejo,
    string EnfermedadActual,
    string? Aislamiento,
    string? ParametrosAntropometria,
    string? TratamientoPrevio,
    string? Observaciones,
    InternacionPacienteDto Paciente,
    InternacionCamaDto Cama,
    ObraSocialDto? ObraSocial,
    IReadOnlyList<MotivoInternacionDto> MotivosInternacion)
{
    public static InternacionDetalleDto FromEntity(Internacion internacion, DateOnly hoy) => new(
        internacion.Id,
        internacion.FechaInternacion,
        internacion.FechaFin,
        internacion.CondicionAlta,
        internacion.EstaActiva,
        internacion.Manejo,
        internacion.EnfermedadActual,
        internacion.Aislamiento,
        internacion.ParametrosAntropometria,
        internacion.TratamientoPrevio,
        internacion.Observaciones,
        InternacionPacienteDto.FromEntity(internacion.Paciente, hoy),
        InternacionCamaDto.FromEntity(internacion.Cama),
        internacion.ObraSocial is not null ? ObraSocialDto.FromEntity(internacion.ObraSocial) : null,
        internacion.MotivosInternacion.Select(MotivoInternacionDto.FromEntity).ToList());
}
