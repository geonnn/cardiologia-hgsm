using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;

public class AgregarPendienteHandler(
    IPacienteRepository pacienteRepository,
    IPendienteRepository pendienteRepository,
    IUnitOfWork unitOfWork
) : ICommandHandler<AgregarPendienteCommand, Guid>
{
    public async Task<ErrorOr<Guid>> HandleAsync(
        AgregarPendienteCommand command,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(command.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        // Solo se pueden agregar pendientes a un paciente internado (RF-44).
        var internacionId = await pendienteRepository.ObtenerInternacionActivaIdAsync(command.PacienteId, ct);
        if (internacionId is null)
            return InternacionErrors.PacienteSinInternacionActiva;

        var pendienteResult = Pendiente.Crear(internacionId.Value, command.Titulo, command.Descripcion);
        if (pendienteResult.IsError)
            return pendienteResult.Errors;

        pendienteRepository.Add(pendienteResult.Value);
        await unitOfWork.SaveChangesAsync(ct);

        return pendienteResult.Value.Id;
    }
}