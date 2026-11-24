using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearPaciente;

public class CrearPacienteHandler(
    IPacienteRepository pacienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearPacienteCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(CrearPacienteCommand command, CancellationToken ct = default)
    {
        var dniResult = Dni.Crear(command.Dni);
        if (dniResult.IsError)
            return dniResult.Errors;

        if (await pacienteRepository.ExisteDniAsync(dniResult.Value, ct))
            return PacienteErrors.DniDuplicado;

        var pacienteResult = Paciente.Crear(
            command.Nombre,
            command.Apellido,
            dniResult.Value,
            command.FechaNacimiento,
            command.Sexo,
            command.Antecedentes,
            command.MedicoDeCabeceraId
        );

        if (pacienteResult.IsError)
            return pacienteResult.Errors;

        pacienteRepository.Add(pacienteResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return pacienteResult.Value.Id;
    }
}
