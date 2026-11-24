namespace CardiologiaHGSM.Application.Pacientes.Commands.CrearEstudio;

public sealed record CrearEstudioCommand(
    Guid PacienteId,
    int TipoEstudioId,
    string Titulo,
    DateTime Fecha,
    string Descripcion
);
