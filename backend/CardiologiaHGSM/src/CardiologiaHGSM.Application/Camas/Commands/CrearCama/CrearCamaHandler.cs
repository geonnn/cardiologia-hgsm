using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using ErrorOr;

namespace CardiologiaHGSM.Application.Camas.Commands.CrearCama;

public class CrearCamaHandler(
    ICamaRepository camaRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearCamaCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(CrearCamaCommand command, CancellationToken ct = default)
    {
        var camaResult = Cama.Crear(command.NumeroCama, command.Sector);
        if (camaResult.IsError)
            return camaResult.Errors;

        if (await camaRepository.ExisteNumeroEnSectorAsync(command.NumeroCama, command.Sector, ct))
            return CamaErrors.NumeroDuplicado;

        camaRepository.Add(camaResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return camaResult.Value.Id;
    }
}
