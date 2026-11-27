using CardiologiaHGSM.Application.Camas;
using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.RegistrarAlta;

public class RegistrarAltaHandler(
    IInternacionRepository internacionRepository,
    ICamaRepository camaRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<RegistrarAltaCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        RegistrarAltaCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        var ahora = DateTimeOffset.UtcNow;
        var fechaFin = FechaEntrada.AjustarDesfasajeReloj(command.FechaFin, ahora);

        var altaResult = internacion.DarAlta(command.CondicionAlta, fechaFin, ahora);
        if (altaResult.IsError)
            return altaResult.Errors;

        var cama = await camaRepository.GetByIdAsync(internacion.CamaId, ct);
        if (cama is null)
            return CamaErrors.NoEncontrada;

        var liberarResult = cama.Liberar();
        if (liberarResult.IsError)
            return liberarResult.Errors;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
