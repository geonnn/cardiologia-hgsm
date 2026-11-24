using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.AgregarContacto;

public class AgregarContactoHandler(
    IPacienteRepository pacienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<AgregarContactoCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        AgregarContactoCommand command,
        CancellationToken ct = default)
    {
        var paciente = await pacienteRepository.GetByIdAsync(command.PacienteId, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        var contactoResult = Contacto.Crear(
            paciente.Id,
            command.Nombre,
            command.Telefono,
            command.Apellido,
            command.Parentesco);

        if (contactoResult.IsError)
            return contactoResult.Errors;

        var agregarResult = paciente.AgregarContacto(contactoResult.Value);
        if (agregarResult.IsError)
            return agregarResult.Errors;

        await unitOfWork.SaveChangesAsync(ct);

        return contactoResult.Value.Id;
    }
}
