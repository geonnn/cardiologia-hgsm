using CardiologiaHGSM.Application.Common;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearEvolucion;

public class CrearEvolucionHandler(
    IInternacionRepository internacionRepository,
    IEvolucionRepository evolucionRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearEvolucionCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        CrearEvolucionCommand command,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.GetByIdAsync(command.InternacionId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        // Solo se pueden registrar evoluciones en una internación activa (RF-38).
        if (!internacion.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var ahora = DateTimeOffset.UtcNow;
        var fecha = FechaEntrada.AjustarDesfasajeReloj(command.Fecha, ahora);

        var evolucionResult = Evolucion.Crear(internacion.Id, command.Detalle, fecha, ahora);
        if (evolucionResult.IsError)
            return evolucionResult.Errors;

        evolucionRepository.Add(evolucionResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return evolucionResult.Value.Id;
    }
}
