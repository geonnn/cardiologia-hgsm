using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.ModificarMisDatos;

public class ModificarMisDatosHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual
) : ICommandHandler<ModificarMisDatosCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(ModificarMisDatosCommand command, CancellationToken ct = default)
    {
        if (usuarioActual.Id is not { } id)
            return UsuarioErrors.NoAutenticado;

        var usuario = await userManager.FindByIdAsync(id.ToString());
        if (usuario is null)
            return UsuarioErrors.NoAutenticado;

        var modificar = usuario.ModificarDatosPersonales(command.Nombre, command.Apellido);
        if (modificar.IsError)
            return modificar.Errors;

        var resultado = await userManager.UpdateAsync(usuario);
        if (!resultado.Succeeded)
            return resultado.ToErrors();

        return Result.Success;
    }
}
