using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Usuarios;

public sealed record CrearUsuarioRequest(
    [Required] string Nombre,
    [Required] string Apellido,
    [Required] string Email,
    [Required] string Password
);
