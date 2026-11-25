namespace CardiologiaHGSM.Application.Usuarios.Dtos;

/// <summary>
/// Resultado de iniciar sesión: el token de acceso (JWT) que el front manda en
/// <c>Authorization: Bearer ...</c>, cuándo vence y los datos del usuario.
/// </summary>
public sealed record SesionDto(
    string AccessToken,
    DateTime ExpiraEn,
    UsuarioActualDto Usuario
);
