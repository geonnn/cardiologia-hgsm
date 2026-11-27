using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearInternacion;

public sealed record CrearInternacionCommand(
    Guid PacienteId,
    Guid CamaId,
    string EnfermedadActual,
    IReadOnlyCollection<int> MotivoInternacionIds,
    Manejo? Manejo = null,
    DateTimeOffset? FechaInternacion = null,
    int? ObraSocialId = null,
    string? Aislamiento = null,
    Guid? CamaAislamientoId = null,
    string? ParametrosAntropometria = null,
    string? TratamientoPrevio = null,
    string? TratamientoActual = null,
    string? Observaciones = null
);
