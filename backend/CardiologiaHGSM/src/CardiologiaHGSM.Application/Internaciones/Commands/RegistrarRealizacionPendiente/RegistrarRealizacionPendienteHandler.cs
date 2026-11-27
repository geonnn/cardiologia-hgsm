using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.RegistrarRealizacionPendiente;

public class RegistrarRealizacionPendienteHandler(
    IInternacionRepository internacionRepository,
    IPendienteRepository pendienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<RegistrarRealizacionPendienteCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        RegistrarRealizacionPendienteCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var pendiente = await pendienteRepository.ObtenerPorIdEnInternacionAsync(
            command.InternacionId,
            command.PendienteId,
            ct);

        if (pendiente is null)
            return InternacionErrors.PendienteNoEncontrado;

        var resultado = pendiente.MarcarComoRealizado();
        if (resultado.IsError)
            return resultado.Errors;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }
}
