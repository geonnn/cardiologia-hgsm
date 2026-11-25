using System.ComponentModel.DataAnnotations;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.WebApi.Contracts.Camas;

// Sector es nullable + [Required] para que si no viene en el body se devuelva 400
// en vez de tomar el valor por defecto del enum (UCO).
public sealed record CrearCamaRequest(
    int NumeroCama,
    [Required] Manejo? Sector
);
