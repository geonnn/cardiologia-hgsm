using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.IniciarSesion;

public class IniciarSesionHandler(
    UserManager<Usuario> userManager,
    ISesionService sesionService
) : ICommandHandler<IniciarSesionCommand, UsuarioActualDto>
{
    public async Task<ErrorOr<UsuarioActualDto>> HandleAsync(IniciarSesionCommand command, CancellationToken ct = default)
    {
        // Mismo error si el email no existe o la contraseña es incorrecta, para no revelar qué cuentas existen.
        var usuario = await userManager.FindByEmailAsync(command.Email.Trim());
        if (usuario is null)
            return UsuarioErrors.CredencialesInvalidas;

        var resultado = await sesionService.IniciarSesionAsync(usuario, command.Password);
        if (resultado.IsError)
            return resultado.Errors;

        var roles = await userManager.GetRolesAsync(usuario);
        return UsuarioActualDto.FromEntity(usuario, roles);
    }
}
