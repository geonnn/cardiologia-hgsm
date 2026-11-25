using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CerrarSesion;

// RF-04: el token deja de valer en el servidor, aunque alguien lo haya copiado antes del logout.
public class CerrarSesionHandler(
    UserManager<Usuario> userManager,
    IUsuarioActual usuarioActual,
    ISesionService sesionService
) : ICommandHandler<CerrarSesionCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(CerrarSesionCommand command, CancellationToken ct = default)
    {
        if (usuarioActual.Id is not { } id)
            return Result.Success;

        var usuario = await userManager.FindByIdAsync(id.ToString());
        if (usuario is not null)
            await sesionService.CerrarSesionesAsync(usuario);

        return Result.Success;
    }
}
