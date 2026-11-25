namespace CardiologiaHGSM.Application.Pacientes.Commands.EliminarContacto;

public sealed record EliminarContactoCommand(
    Guid PacienteId,
    Guid ContactoId
);
