using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearPaciente;

public class CrearPacienteHandler(
    IPacienteRepository pacienteRepository,
    IMedicoDeCabeceraRepository medicoDeCabeceraRepository,
    IFactorDeRiesgoRepository factorDeRiesgoRepository,
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

        if (command.MedicoDeCabeceraId is { } medicoId &&
            !await medicoDeCabeceraRepository.ExisteAsync(medicoId, ct))
            return PacienteErrors.MedicoDeCabeceraNoEncontrado;

        var idsFactores = command.FactorDeRiesgoIds?.Distinct().ToList() ?? [];
        var factores = idsFactores.Count > 0
            ? await factorDeRiesgoRepository.GetByIdsAsync(idsFactores, ct)
            : [];

        if (factores.Count != idsFactores.Count)
            return PacienteErrors.FactorDeRiesgoNoEncontrado;

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

        var paciente = pacienteResult.Value;

        if (command.Contactos is { Count: > 0 })
        {
            foreach (var contactoInput in command.Contactos)
            {
                var contactoResult = Contacto.Crear(
                    paciente.Id,
                    contactoInput.Nombre,
                    contactoInput.Telefono,
                    contactoInput.Apellido,
                    contactoInput.Parentesco);

                if (contactoResult.IsError)
                    return contactoResult.Errors;

                var agregarResult = paciente.AgregarContacto(contactoResult.Value);
                if (agregarResult.IsError)
                    return agregarResult.Errors;
            }
        }

        if (factores.Count > 0)
            paciente.ReemplazarFactoresDeRiesgo(factores);

        pacienteRepository.Add(paciente);
        await unitOfWork.SaveChangesAsync(ct);

        return paciente.Id;
    }
}
