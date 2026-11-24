using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.EliminarEstudio;

public class EliminarEstudioHandler(
    IEstudioRepository estudioRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<EliminarEstudioCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        EliminarEstudioCommand command,
        CancellationToken ct = default)
    {
        var estudio = await estudioRepository.GetByIdAsync(command.EstudioId, ct);
        if (estudio is null || estudio.PacienteId != command.PacienteId)
            return EstudioErrors.NoEncontrado;

        estudioRepository.Remove(estudio);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
