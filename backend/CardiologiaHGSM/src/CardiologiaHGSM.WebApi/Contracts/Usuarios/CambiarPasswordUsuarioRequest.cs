using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Usuarios;

public sealed record CambiarPasswordUsuarioRequest(
    [Required] string PasswordNueva,
    [Required] string ConfirmacionPassword
);
