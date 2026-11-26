using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.ModificarContacto;

public class ModificarContactoHandler(
    IPacienteRepository pacienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<ModificarContactoCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        ModificarContactoCommand command,
        CancellationToken ct = default)
    {
        var paciente = await pacienteRepository.GetByIdAsync(command.PacienteId, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        var modificarResult = paciente.ModificarContacto(
            command.ContactoId,
            command.Nombre,
            command.Telefono,
            command.Apellido,
            command.Parentesco);

        if (modificarResult.IsError)
            return modificarResult.Errors;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
