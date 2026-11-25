using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CambiarPasswordUsuario;

// RF-07: el administrador cambia la contraseña de un usuario sin conocer la actual.
public class CambiarPasswordUsuarioHandler(
    UserManager<Usuario> userManager
) : ICommandHandler<CambiarPasswordUsuarioCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(CambiarPasswordUsuarioCommand command, CancellationToken ct = default)
    {
        if (command.PasswordNueva != command.ConfirmacionPassword)
            return UsuarioErrors.PasswordsNoCoinciden;

        var usuario = await userManager.FindByIdAsync(command.UsuarioId.ToString());
        if (usuario is null)
            return UsuarioErrors.NoEncontrado;

        // Reset con token: valida la política y renueva el security stamp, lo que invalida
        // los tokens de ese usuario. Si el admin se cambia su propia contraseña por acá,
        // también se le cierra la sesión (para seguir logueado está PUT /api/auth/me/password).
        var token = await userManager.GeneratePasswordResetTokenAsync(usuario);
        var resultado = await userManager.ResetPasswordAsync(usuario, token, command.PasswordNueva);
        if (!resultado.Succeeded)
            return resultado.ToErrors();

        // Si estaba bloqueado por intentos fallidos, se desbloquea.
        await userManager.SetLockoutEndDateAsync(usuario, null);
        await userManager.ResetAccessFailedCountAsync(usuario);

        return Result.Success;
    }
}
