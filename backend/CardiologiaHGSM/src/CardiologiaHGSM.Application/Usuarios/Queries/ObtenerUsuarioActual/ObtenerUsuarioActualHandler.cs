using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Queries.ObtenerUsuarioActual;

public class ObtenerUsuarioActualHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual
) : IQueryHandler<ObtenerUsuarioActualQuery, UsuarioActualDto>
{
    public async Task<ErrorOr<UsuarioActualDto>> HandleAsync(ObtenerUsuarioActualQuery query, CancellationToken ct = default)
    {
        if (usuarioActual.Id is not { } id)
            return UsuarioErrors.NoAutenticado;

        var usuario = await userManager.FindByIdAsync(id.ToString());
        if (usuario is null)
            return UsuarioErrors.NoAutenticado;

        var roles = await userManager.GetRolesAsync(usuario);
        return UsuarioActualDto.FromEntity(usuario, roles);
    }
}
