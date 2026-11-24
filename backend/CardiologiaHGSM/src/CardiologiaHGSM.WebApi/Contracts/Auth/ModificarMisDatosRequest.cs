using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Auth;

public sealed record ModificarMisDatosRequest(
    [Required] string Nombre,
    [Required] string Apellido
);
