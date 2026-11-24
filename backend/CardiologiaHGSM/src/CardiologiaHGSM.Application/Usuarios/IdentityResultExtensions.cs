using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios;

public static class IdentityResultExtensions
{
    /// <summary>
    /// Convierte los errores de Identity en errores de ErrorOr, reutilizando los de UsuarioErrors cuando corresponde.
    /// </summary>
    public static List<Error> ToErrors(this IdentityResult result) =>
        result.Errors
            .Select(e => e.Code switch
            {
                nameof(IdentityErrorDescriber.DuplicateEmail) or nameof(IdentityErrorDescriber.DuplicateUserName)
                    => UsuarioErrors.EmailDuplicado,
                nameof(IdentityErrorDescriber.PasswordMismatch)
                    => UsuarioErrors.PasswordActualIncorrecta,
                _ => Error.Validation(code: $"Usuario.{e.Code}", description: e.Description)
            })
            .Distinct()
            .ToList();
}
