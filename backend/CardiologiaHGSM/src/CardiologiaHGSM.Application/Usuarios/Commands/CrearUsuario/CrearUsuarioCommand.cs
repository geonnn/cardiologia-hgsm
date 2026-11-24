namespace CardiologiaHGSM.Application.Usuarios.Commands.CrearUsuario;

public sealed record CrearUsuarioCommand(
    string Nombre,
    string Apellido,
    string Email,
    string Password
);
