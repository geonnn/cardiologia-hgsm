using CardiologiaHGSM.Application.Usuarios;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Infrastructure.Identity;

public class SesionService(SignInManager<Usuario> signInManager) : ISesionService
{
    public async Task<ErrorOr<Success>> IniciarSesionAsync(Usuario usuario, string password)
    {
        // isPersistent: false -> cookie de sesión (se borra al cerrar el navegador; PCs compartidas del hospital)
        // lockoutOnFailure: true -> cuenta los intentos fallidos para el bloqueo temporal
        var resultado = await signInManager.PasswordSignInAsync(
            usuario, password, isPersistent: false, lockoutOnFailure: true);

        if (resultado.Succeeded)
            return Result.Success;

        if (resultado.IsLockedOut)
            return UsuarioErrors.Bloqueado;

        return UsuarioErrors.CredencialesInvalidas;
    }

    public Task CerrarSesionAsync() => signInManager.SignOutAsync();

    public Task RefrescarSesionAsync(Usuario usuario) => signInManager.RefreshSignInAsync(usuario);
}
