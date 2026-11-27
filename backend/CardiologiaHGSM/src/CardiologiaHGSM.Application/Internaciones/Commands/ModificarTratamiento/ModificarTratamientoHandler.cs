using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.ModificarTratamiento;

public class ModificarTratamientoHandler(
    IInternacionRepository internacionRepository,
    ITratamientoRepository tratamientoRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<ModificarTratamientoCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        ModificarTratamientoCommand command,
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

        // Solo se permite modificar el último tratamiento vigente (RF-42).
        var ultimoId = await tratamientoRepository.ObtenerUltimoIdAsync(command.InternacionId, ct);
        if (ultimoId != tratamiento.Id)
            return InternacionErrors.SoloUltimoTratamientoModificable;

        var resultado = tratamiento.Modificar(command.Descripcion, command.Fecha);
        if (resultado.IsError)
            return resultado.Errors;

        await unitOfWork.SaveChangesAsync(ct);
        return Result.Success;
    }
}
