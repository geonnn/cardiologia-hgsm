using System.ComponentModel.DataAnnotations;

namespace CardiologiaHGSM.WebApi.Contracts.Auth;

public sealed record LoginRequest(
    [Required] string Email,
    [Required] string Password
);
