using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.ModificarPaciente;

public class ModificarPacienteHandler(
    IPacienteRepository pacienteRepository,
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

        // TODO: Validar que command.MedicoDeCabeceraId exista en la BD cuando se implemente IMedicoDeCabeceraRepository (módulo Catalogos).

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
