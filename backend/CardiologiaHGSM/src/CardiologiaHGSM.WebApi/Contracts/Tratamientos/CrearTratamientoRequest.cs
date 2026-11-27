using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Tratamientos;

public sealed record CrearTratamientoRequest(
    [Required] string Descripcion,
    DateTimeOffset? Fecha = null
);
