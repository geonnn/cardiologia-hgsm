using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CardiologiaHGSM.Domain.Usuarios;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;

namespace CardiologiaHGSM.Infrastructure.Identity;

/// <summary>
/// Se ejecuta en cada request, después de validar la firma y el vencimiento del JWT.
/// Rechaza el token si el usuario ya no existe (RF-09) o si su security stamp cambió
/// desde que se emitió: logout (RF-04) o cambio de contraseña (RF-06, RF-07).
/// </summary>
public class ValidadorDeToken(UserManager<Usuario> userManager)
{
    public async Task<bool> EsValidoAsync(ClaimsPrincipal principal)
    {
        var id = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var stampDelToken = principal.FindFirstValue(JwtClaims.SecurityStamp);
        if (id is null || stampDelToken is null)
            return false;

        var usuario = await userManager.FindByIdAsync(id);
        if (usuario is null)
            return false;

        var stampActual = JwtClaims.HashSecurityStamp(await userManager.GetSecurityStampAsync(usuario));
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(stampDelToken),
            Encoding.UTF8.GetBytes(stampActual));
    }
}
