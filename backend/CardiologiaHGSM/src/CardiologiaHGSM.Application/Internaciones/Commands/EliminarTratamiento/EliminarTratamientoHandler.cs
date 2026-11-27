using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.EliminarTratamiento;

public class EliminarTratamientoHandler(
    IInternacionRepository internacionRepository,
    ITratamientoRepository tratamientoRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<EliminarTratamientoCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        EliminarTratamientoCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var tratamiento = await tratamientoRepository.ObtenerPorIdEnInternacionAsync(
            command.InternacionId,
            command.TratamientoId,
            ct);

        if (tratamiento is null)
            return InternacionErrors.TratamientoNoEncontrado;

        tratamientoRepository.Remove(tratamiento);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
