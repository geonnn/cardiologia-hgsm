namespace CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;

public sealed record AgregarPendienteCommand(
    Guid InternacionId,
    string Titulo,
    string Descripcion
);
