namespace CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;

public sealed record AgregarPendienteCommand(
    Guid PacienteId,
    string Titulo,
    string Descripcion
);