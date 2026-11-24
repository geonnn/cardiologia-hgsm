using CardiologiaHGSM.Domain.Usuarios;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Infrastructure.Identity;

/// <summary>
/// Identity no trae una opción de longitud máxima de contraseña; el SRS (RF-02) pide máximo 12 caracteres.
/// </summary>
public class PasswordLongitudMaximaValidator : IPasswordValidator<Usuario>
{
    public Task<IdentityResult> ValidateAsync(UserManager<Usuario> manager, Usuario user, string? password)
    {
        if (password is not null && password.Length > Usuario.MaxLongitudPassword)
        {
            return Task.FromResult(IdentityResult.Failed(new IdentityError
            {
                Code = "PasswordTooLong",
                Description = $"La contraseña no puede superar los {Usuario.MaxLongitudPassword} caracteres."
            }));
        }

        return Task.FromResult(IdentityResult.Success);
    }
}
