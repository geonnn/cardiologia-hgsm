using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CambiarMiPassword;

public class CambiarMiPasswordHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual,
    ISesionService sesionService
) : ICommandHandler<CambiarMiPasswordCommand, SesionDto>
{
    public async Task<ErrorOr<SesionDto>> HandleAsync(CambiarMiPasswordCommand command, CancellationToken ct = default)
    {
        if (usuarioActual.Id is not { } id)
            return UsuarioErrors.NoAutenticado;

        if (command.PasswordNueva != command.ConfirmacionPassword)
            return UsuarioErrors.PasswordsNoCoinciden;

        var usuario = await userManager.FindByIdAsync(id.ToString());
        if (usuario is null)
            return UsuarioErrors.NoAutenticado;

        // Valida la contraseña actual y la política de la nueva; además renueva el security stamp,
        // lo que invalida todos los tokens del usuario (también el que usó para este request).
        var resultado = await userManager.ChangePasswordAsync(usuario, command.PasswordActual, command.PasswordNueva);
        if (!resultado.Succeeded)
            return resultado.ToErrors();

        // Se le emite un token nuevo para que siga trabajando en este dispositivo.
        return await sesionService.EmitirTokenAsync(usuario);
    }
}
