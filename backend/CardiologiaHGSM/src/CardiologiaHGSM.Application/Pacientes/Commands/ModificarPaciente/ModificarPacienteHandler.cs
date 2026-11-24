using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.ModificarPaciente;

public class ModificarPacienteHandler(
    IPacienteRepository pacienteRepository,
    IMedicoDeCabeceraRepository medicoDeCabeceraRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<ModificarPacienteCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        ModificarPacienteCommand command,
        CancellationToken ct = default)
    {
        var paciente = await pacienteRepository.GetByIdAsync(command.Id, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        var dniResult = Dni.Crear(command.Dni);
        if (dniResult.IsError)
            return dniResult.Errors;

        if (paciente.Dni != dniResult.Value && await pacienteRepository.ExisteDniAsync(dniResult.Value, ct))
            return PacienteErrors.DniDuplicado;

        if (command.MedicoDeCabeceraId is { } medicoId &&
            medicoId != paciente.MedicoDeCabeceraId &&
            !await medicoDeCabeceraRepository.ExisteAsync(medicoId, ct))
            return PacienteErrors.MedicoDeCabeceraNoEncontrado;

        var modificarResult = paciente.ModificarDatos(
            command.Nombre,
            command.Apellido,
            dniResult.Value,
            command.FechaNacimiento,
            command.Sexo,
            command.Antecedentes,
            command.MedicoDeCabeceraId
        );

        if (modificarResult.IsError)
            return modificarResult.Errors;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
