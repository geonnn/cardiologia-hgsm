using CardiologiaHGSM.Application.Catalogos.Dtos;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record InternacionResumenDto(
    Guid Id,
    DateTimeOffset FechaInternacion,
    DateTimeOffset? FechaFin,
    CondicionAlta? CondicionAlta,
    bool EstaActiva,
    Manejo Manejo,
    InternacionCamaDto Cama,
    IReadOnlyList<MotivoInternacionDto> MotivosInternacion)
{
    public static InternacionResumenDto FromEntity(Internacion internacion) => new(
        internacion.Id,
        internacion.FechaInternacion,
        internacion.FechaFin,
        internacion.CondicionAlta,
        internacion.EstaActiva,
        internacion.Manejo,
        InternacionCamaDto.FromEntity(internacion.Cama),
        internacion.MotivosInternacion.Select(MotivoInternacionDto.FromEntity).ToList());
}
