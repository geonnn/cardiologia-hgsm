using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.ReemplazarFactoresDeRiesgo;

public class ReemplazarFactoresDeRiesgoHandler(
    IPacienteRepository pacienteRepository,
    IFactorDeRiesgoRepository factorDeRiesgoRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<ReemplazarFactoresDeRiesgoCommand>
{
    public async Task<ErrorOr<Success>> HandleAsync(
        ReemplazarFactoresDeRiesgoCommand command,
        CancellationToken ct = default)
    {
        var paciente = await pacienteRepository.GetByIdAsync(command.PacienteId, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        var idsUnicos = command.FactorDeRiesgoIds.Distinct().ToList();
        var factores = idsUnicos.Count > 0
            ? await factorDeRiesgoRepository.GetByIdsAsync(idsUnicos, ct)
            : [];

        if (factores.Count != idsUnicos.Count)
            return PacienteErrors.FactorDeRiesgoNoEncontrado;

        paciente.ReemplazarFactoresDeRiesgo(factores);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Success;
    }
}
