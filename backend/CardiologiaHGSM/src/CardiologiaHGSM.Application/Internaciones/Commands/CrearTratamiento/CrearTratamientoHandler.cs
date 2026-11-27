using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearTratamiento;

public class CrearTratamientoHandler(
    IInternacionRepository internacionRepository,
    ITratamientoRepository tratamientoRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearTratamientoCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        CrearTratamientoCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        // Solo se pueden registrar tratamientos en una internación activa (RF-40).
        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var tratamientoResult = Tratamiento.Crear(
            internacion.Id,
            command.Descripcion,
            command.Fecha);

        if (tratamientoResult.IsError)
            return tratamientoResult.Errors;

        tratamientoRepository.Add(tratamientoResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return tratamientoResult.Value.Id;
    }
}
