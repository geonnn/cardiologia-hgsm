using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Evoluciones;

public sealed record CrearEvolucionRequest(
    [Required] string Detalle,
    [Required] DateTimeOffset? Fecha
);
