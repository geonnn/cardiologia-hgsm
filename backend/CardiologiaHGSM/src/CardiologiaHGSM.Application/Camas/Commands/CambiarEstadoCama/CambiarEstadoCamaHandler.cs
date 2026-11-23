using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using ErrorOr;

namespace CardiologiaHGSM.Application.Camas.Commands.CambiarEstadoCama;

public class CambiarEstadoCamaHandler(
    ICamaRepository camaRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CambiarEstadoCamaCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(CambiarEstadoCamaCommand command, CancellationToken ct = default)
    {
        var cama = await camaRepository.GetByIdAsync(command.CamaId, ct);
        if (cama is null)
            return CamaErrors.NoEncontrada;

        var result = command.Accion switch
        {
            AccionEstadoCama.BloquearPorAislamiento => cama.BloquearPorAislamiento(),
            AccionEstadoCama.Desbloquear => cama.Desbloquear(),
            AccionEstadoCama.Deshabilitar => cama.Deshabilitar(),
            AccionEstadoCama.Habilitar => cama.Habilitar(),
            _ => throw new ArgumentOutOfRangeException(nameof(command), command.Accion, "Acción no soportada.")
        };

        if (result.IsError)
            return result.Errors;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }
}
