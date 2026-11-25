using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.EliminarContacto;

public class EliminarContactoHandler(
    IPacienteRepository pacienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<EliminarContactoCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        EliminarContactoCommand command,
        CancellationToken ct = default)
    {
        var paciente = await pacienteRepository.GetByIdAsync(command.PacienteId, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        var eliminarResult = paciente.EliminarContacto(command.ContactoId);
        if (eliminarResult.IsError)
            return eliminarResult.Errors;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
