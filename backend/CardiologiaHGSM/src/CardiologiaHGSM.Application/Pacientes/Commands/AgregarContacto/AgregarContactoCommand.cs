namespace CardiologiaHGSM.Application.Pacientes.Commands.AgregarContacto;

public sealed record AgregarContactoCommand(
    Guid PacienteId,
    string Nombre,
    string Telefono,
    string? Apellido = null,
    string? Parentesco = null
);
