namespace CardiologiaHGSM.Application.Pacientes.Commands.ModificarContacto;

public sealed record ModificarContactoCommand(
    Guid PacienteId,
    Guid ContactoId,
    string Nombre,
    string Telefono,
    string? Apellido = null,
    string? Parentesco = null
);
