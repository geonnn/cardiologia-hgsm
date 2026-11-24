using CardiologiaHGSM.Application.Common.Interfaces;
using ErrorOr;

namespace CardiologiaHGSM.Application.Usuarios.Commands.CerrarSesion;

public class CerrarSesionHandler(
    ISesionService sesionService
) : ICommandHandler<CerrarSesionCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(CerrarSesionCommand command, CancellationToken ct = default)
    {
        await sesionService.CerrarSesionAsync();
        return Result.Success;
    }
}
