namespace CardiologiaHGSM.Application.Pacientes.Commands.EliminarEstudio;

public sealed record EliminarEstudioCommand(
    Guid PacienteId,
    Guid EstudioId
);
