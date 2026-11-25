using System.Security.Cryptography;
using System.Text;

namespace CardiologiaHGSM.Infrastructure.Identity;

/// <summary>
/// Claims propios que lleva el token, además de "sub" (id del usuario) y "jti".
/// </summary>
public static class JwtClaims
{
    public const string Rol = "role";

    // Hash del security stamp de Identity al momento de emitir el token. Si el stamp cambia
    // (logout, cambio de contraseña), el hash deja de coincidir y el token se rechaza.
    // Va hasheado porque el stamp también se usa para generar otros tokens de Identity y el JWT es legible.
    public const string SecurityStamp = "sstamp";

    public static string HashSecurityStamp(string stamp) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(stamp)));
}
