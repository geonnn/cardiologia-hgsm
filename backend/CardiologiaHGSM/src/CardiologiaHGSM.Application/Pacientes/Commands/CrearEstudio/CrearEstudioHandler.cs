using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearEstudio;

public class CrearEstudioHandler(
    IPacienteRepository pacienteRepository,
    ITipoEstudioRepository tipoEstudioRepository,
    IEstudioRepository estudioRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<CrearEstudioCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        CrearEstudioCommand command,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(command.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        if (!await tipoEstudioRepository.ExisteAsync(command.TipoEstudioId, ct))
            return EstudioErrors.TipoEstudioNoEncontrado;

        var estudioResult = Estudio.Crear(
            command.PacienteId,
            command.TipoEstudioId,
            command.Titulo,
            command.Fecha,
            command.Descripcion);

        if (estudioResult.IsError)
            return estudioResult.Errors;

        estudioRepository.Add(estudioResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return estudioResult.Value.Id;
    }
}
