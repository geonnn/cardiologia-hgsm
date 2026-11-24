using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.WebApi.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddAutenticacion(this IServiceCollection services)
    {
        services
            .AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddIdentityCookies();

        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.Name = "hgsm.auth";
            options.Cookie.HttpOnly = true;               // el JS del front no puede leerla
            options.Cookie.SameSite = SameSiteMode.Strict; // protección contra CSRF
            // Secure si el request viene por HTTPS; hoy prod sirve HTTP en el puerto 80
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            options.ExpireTimeSpan = TimeSpan.FromHours(12);
            options.SlidingExpiration = true;

            // Es una API: en vez de redirigir a /Account/Login, devolver 401/403.
            // Se asignan solo estos dos eventos: reemplazar options.Events entero borraría el
            // OnValidatePrincipal que Identity usa para validar el security stamp.
            options.Events.OnRedirectToLogin = ctx =>
            {
                ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = ctx =>
            {
                ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        // Si a un usuario le cambian la contraseña o lo eliminan, sus sesiones abiertas
        // dejan de ser válidas en a lo sumo 1 minuto (por defecto son 30).
        services.Configure<SecurityStampValidatorOptions>(options =>
            options.ValidationInterval = TimeSpan.FromMinutes(1));

        services.AddAuthorization();

        return services;
    }
}
