namespace CardiologiaHGSM.Application.Usuarios.Commands.IniciarSesion;

public sealed record IniciarSesionCommand(
    string Email,
    string Password
);
