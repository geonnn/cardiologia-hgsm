using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Auth;

public sealed record CambiarMiPasswordRequest(
    [Required] string PasswordActual,
    [Required] string PasswordNueva,
    [Required] string ConfirmacionPassword
);
