using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;

namespace CardiologiaHGSM.Application.Usuarios;

/// <summary>
/// Manejo de la sesión (cookie) del usuario. La implementación vive en Infrastructure (SignInManager).
/// </summary>
public interface ISesionService
{
    Task<ErrorOr<Success>> IniciarSesionAsync(Usuario usuario, string password);
    Task CerrarSesionAsync();

    // Reemite la cookie (p. ej. después de cambiar la contraseña, que invalida la sesión actual).
    Task RefrescarSesionAsync(Usuario usuario);
}
