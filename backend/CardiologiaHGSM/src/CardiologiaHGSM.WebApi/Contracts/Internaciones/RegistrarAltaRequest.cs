using System.ComponentModel.DataAnnotations;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.WebApi.Contracts.Internaciones;

public sealed record RegistrarAltaRequest(
    [Required] CondicionAlta? CondicionAlta,
    [Required] DateTimeOffset? FechaFin
);
