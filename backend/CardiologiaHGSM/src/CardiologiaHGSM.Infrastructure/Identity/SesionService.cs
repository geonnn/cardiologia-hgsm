using System.Security.Claims;
using CardiologiaHGSM.Application.Usuarios;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Domain.Usuarios;
using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace CardiologiaHGSM.Infrastructure.Identity;

public class SesionService(
    SignInManager<Usuario> signInManager,
    UserManager<Usuario> userManager,
    IOptions<JwtOptions> jwtOptions,
    TimeProvider timeProvider
) : ISesionService
{
    private static readonly JsonWebTokenHandler TokenHandler = new();

    public async Task<ErrorOr<Success>> VerificarCredencialesAsync(Usuario usuario, string password)
    {
        // lockoutOnFailure: true -> cuenta los intentos fallidos para el bloqueo temporal
        var resultado = await signInManager.CheckPasswordSignInAsync(usuario, password, lockoutOnFailure: true);

        if (resultado.Succeeded)
            return Result.Success;

        if (resultado.IsLockedOut)
            return UsuarioErrors.Bloqueado;

        return UsuarioErrors.CredencialesInvalidas;
    }

    public async Task<SesionDto> EmitirTokenAsync(Usuario usuario)
    {
        var jwt = jwtOptions.Value;
        var roles = await userManager.GetRolesAsync(usuario);
        var stamp = await userManager.GetSecurityStampAsync(usuario);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
            new(JwtClaims.SecurityStamp, JwtClaims.HashSecurityStamp(stamp)),
        };
        claims.AddRange(roles.Select(rol => new Claim(JwtClaims.Rol, rol)));

        var ahora = timeProvider.GetUtcNow().UtcDateTime;
        var expira = ahora.AddHours(jwt.ExpiracionHoras);

        var token = TokenHandler.CreateToken(new SecurityTokenDescriptor
        {
            Issuer = jwt.Issuer,
            Audience = jwt.Audience,
            Subject = new ClaimsIdentity(claims),
            IssuedAt = ahora,
            NotBefore = ahora,
            Expires = expira,
            SigningCredentials = new SigningCredentials(jwt.ObtenerClaveDeFirma(), SecurityAlgorithms.HmacSha256),
        });

        return new SesionDto(token, expira, UsuarioActualDto.FromEntity(usuario, roles));
    }

    // Renovar el stamp invalida todos los tokens emitidos antes (ver ValidadorDeToken).
    public Task CerrarSesionesAsync(Usuario usuario) => userManager.UpdateSecurityStampAsync(usuario);
}
