using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Pacientes;

// TipoEstudioId y Fecha son nullable + [Required] para que si faltan en el body se devuelva 400
// en vez de tomar valores por defecto (0 o DateTime.MinValue).
public sealed record CrearEstudioRequest(
    [Required] int? TipoEstudioId,
    [Required] string Titulo,
    [Required] DateTime? Fecha,
    [Required] string Descripcion
);
