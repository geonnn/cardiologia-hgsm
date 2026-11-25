using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace CardiologiaHGSM.WebApi.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddAutenticacion(this IServiceCollection services)
    {
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        // Se configura a partir de JwtOptions (validadas al arrancar) en vez de leer la configuración a mano.
        services
            .AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtOptions>>((options, jwtOptions) =>
            {
                var jwt = jwtOptions.Value;

                // Usar los nombres de claim del token tal cual ("sub", "role") en lugar de los de ClaimTypes.
                options.MapInboundClaims = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwt.Issuer,
                    ValidAudience = jwt.Audience,
                    IssuerSigningKey = jwt.ObtenerClaveDeFirma(),
                    ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                    RoleClaimType = JwtClaims.Rol,
                    ClockSkew = TimeSpan.FromSeconds(30),
                };

                // Además de firma y vencimiento: el usuario tiene que existir y no haber cerrado sesión
                // ni cambiado la contraseña desde que se emitió el token.
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async ctx =>
                    {
                        var validador = ctx.HttpContext.RequestServices.GetRequiredService<ValidadorDeToken>();
                        if (ctx.Principal is null || !await validador.EsValidoAsync(ctx.Principal))
                            ctx.Fail("La sesión ya no es válida.");
                    },
                };
            });

        // Seguridad (RNF): todos los endpoints exigen sesión salvo los marcados con [AllowAnonymous] (login).
        services.AddAuthorizationBuilder()
            .SetFallbackPolicy(new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build());

        services.AddHttpContextAccessor();
        services.AddScoped<IUsuarioActual, UsuarioActual>();

        return services;
    }
}
