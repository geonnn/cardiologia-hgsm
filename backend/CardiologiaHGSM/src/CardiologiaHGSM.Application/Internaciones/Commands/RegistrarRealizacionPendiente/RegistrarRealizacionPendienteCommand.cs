namespace CardiologiaHGSM.Application.Internaciones.Commands.RegistrarRealizacionPendiente;

public sealed record RegistrarRealizacionPendienteCommand(
    Guid InternacionId,
    Guid PendienteId
);
