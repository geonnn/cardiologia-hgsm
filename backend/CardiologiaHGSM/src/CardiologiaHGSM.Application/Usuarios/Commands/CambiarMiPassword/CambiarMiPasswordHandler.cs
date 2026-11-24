using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CambiarMiPassword;

public class CambiarMiPasswordHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual,
    ISesionService sesionService
) : ICommandHandler<CambiarMiPasswordCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(CambiarMiPasswordCommand command, CancellationToken ct = default)
    {
        if (usuarioActual.Id is not { } id)
            return UsuarioErrors.NoAutenticado;

        if (command.PasswordNueva != command.ConfirmacionPassword)
            return UsuarioErrors.PasswordsNoCoinciden;

        var usuario = await userManager.FindByIdAsync(id.ToString());
        if (usuario is null)
            return UsuarioErrors.NoAutenticado;

        // Valida la contraseña actual y la política de la nueva; además renueva el security stamp,
        // lo que cierra las demás sesiones abiertas del usuario.
        var resultado = await userManager.ChangePasswordAsync(usuario, command.PasswordActual, command.PasswordNueva);
        if (!resultado.Succeeded)
            return resultado.ToErrors();

        // La sesión actual también quedó invalidada por el nuevo stamp: se reemite la cookie.
        await sesionService.RefrescarSesionAsync(usuario);
        return Result.Success;
    }
}
