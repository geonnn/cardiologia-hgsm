namespace CardiologiaHGSM.Application.Usuarios.Commands.CambiarMiPassword;

public sealed record CambiarMiPasswordCommand(
    string PasswordActual,
    string PasswordNueva,
    string ConfirmacionPassword
);
