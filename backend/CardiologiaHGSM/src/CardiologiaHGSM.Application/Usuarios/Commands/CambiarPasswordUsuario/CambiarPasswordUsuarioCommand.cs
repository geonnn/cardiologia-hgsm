namespace CardiologiaHGSM.Application.Usuarios.Commands.CambiarPasswordUsuario;

public sealed record CambiarPasswordUsuarioCommand(
    Guid UsuarioId,
    string PasswordNueva,
    string ConfirmacionPassword
);
