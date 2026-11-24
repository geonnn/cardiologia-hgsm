using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.EliminarUsuario;

// RF-09: borrado físico. Sus sesiones abiertas dejan de valer al validar el security stamp.
public class EliminarUsuarioHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual
) : ICommandHandler<EliminarUsuarioCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(EliminarUsuarioCommand command, CancellationToken ct = default)
    {
        if (usuarioActual.Id == command.UsuarioId)
            return UsuarioErrors.NoPuedeEliminarseASiMismo;

        var usuario = await userManager.FindByIdAsync(command.UsuarioId.ToString());
        if (usuario is null)
            return UsuarioErrors.NoEncontrado;

        if (await userManager.IsInRoleAsync(usuario, Rol.Administrador))
        {
            var administradores = await userManager.GetUsersInRoleAsync(Rol.Administrador);
            if (administradores.Count <= 1)
                return UsuarioErrors.UltimoAdministrador;
        }

        var resultado = await userManager.DeleteAsync(usuario);
        if (!resultado.Succeeded)
            return resultado.ToErrors();

        return Result.Success;
    }
}
