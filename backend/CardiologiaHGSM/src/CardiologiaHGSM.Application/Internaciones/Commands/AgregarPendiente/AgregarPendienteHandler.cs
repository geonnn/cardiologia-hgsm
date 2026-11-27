using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;

public class AgregarPendienteHandler(
    IInternacionRepository internacionRepository,
    IPendienteRepository pendienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<AgregarPendienteCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        AgregarPendienteCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        // Solo se pueden agregar pendientes a una internación activa (RF-44).
        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var pendienteResult = Pendiente.Crear(internacion.Id, command.Titulo, command.Descripcion);
        if (pendienteResult.IsError)
            return pendienteResult.Errors;

        pendienteRepository.Add(pendienteResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return pendienteResult.Value.Id;
    }
}
