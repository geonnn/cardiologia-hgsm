using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record EvolucionDto(
    Guid Id,
    Guid InternacionId,
    string Detalle,
    DateTimeOffset Fecha)
{
    public static EvolucionDto FromEntity(Evolucion evolucion) => new(
        evolucion.Id,
        evolucion.InternacionId,
        evolucion.Detalle,
        evolucion.Fecha
    );
}
