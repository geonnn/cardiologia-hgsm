using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;

namespace CardiologiaHGSM.Application.Usuarios;

/// <summary>
/// Emisión y revocación de los tokens de acceso (JWT). La implementación vive en Infrastructure.
/// </summary>
public interface ISesionService
{
    // Verifica la contraseña contando los intentos fallidos para el bloqueo temporal.
    Task<ErrorOr<Success>> VerificarCredencialesAsync(Usuario usuario, string password);

    // Emite un token nuevo para el usuario.
    Task<SesionDto> EmitirTokenAsync(Usuario usuario);

    // Invalida todos los tokens emitidos al usuario hasta ahora (en todos sus dispositivos).
    Task CerrarSesionesAsync(Usuario usuario);
}
