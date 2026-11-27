namespace CardiologiaHGSM.Application.Internaciones.Commands.DesmarcarRealizacionPendiente;

public sealed record DesmarcarRealizacionPendienteCommand(
    Guid InternacionId,
    Guid PendienteId
);
