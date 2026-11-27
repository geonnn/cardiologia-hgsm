using System.ComponentModel.DataAnnotations;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.WebApi.Contracts.Internaciones;

// PacienteId y CamaId son nullable + [Required] para devolver 400 explícito si faltan en el body.
public sealed record CrearInternacionRequest(
    [Required] Guid? PacienteId,
    [Required] Guid? CamaId,
    [Required] string EnfermedadActual,
    [Required] IReadOnlyCollection<int> MotivoInternacionIds,
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
