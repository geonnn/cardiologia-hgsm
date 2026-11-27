using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Internaciones.Commands.ModificarInternacion;

public sealed record ModificarInternacionCommand(
    Guid InternacionId,
    Guid CamaId,
    DateTimeOffset FechaInternacion,
    Manejo Manejo,
    string EnfermedadActual,
    IReadOnlyCollection<int> MotivoInternacionIds,
    int? ObraSocialId = null,
    string? Aislamiento = null,
    Guid? CamaAislamientoId = null,
    string? ParametrosAntropometria = null,
    string? TratamientoPrevio = null,
    string? Observaciones = null
);
