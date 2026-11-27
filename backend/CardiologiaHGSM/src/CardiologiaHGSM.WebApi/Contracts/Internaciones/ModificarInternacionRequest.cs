using System.ComponentModel.DataAnnotations;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.WebApi.Contracts.Internaciones;

public sealed record ModificarInternacionRequest(
    [Required] Guid? CamaId,
    [Required] DateTimeOffset? FechaInternacion,
    [Required] Manejo? Manejo,
    [Required] string EnfermedadActual,
    [Required] IReadOnlyCollection<int> MotivoInternacionIds,
    int? ObraSocialId = null,
    string? Aislamiento = null,
    Guid? CamaAislamientoId = null,
    string? ParametrosAntropometria = null,
    string? TratamientoPrevio = null,
    string? Observaciones = null
);
