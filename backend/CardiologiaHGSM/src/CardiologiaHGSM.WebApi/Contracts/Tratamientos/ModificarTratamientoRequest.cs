using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Tratamientos;

public sealed record ModificarTratamientoRequest(
    [Required] string Descripcion,
    DateTimeOffset? Fecha = null
);
