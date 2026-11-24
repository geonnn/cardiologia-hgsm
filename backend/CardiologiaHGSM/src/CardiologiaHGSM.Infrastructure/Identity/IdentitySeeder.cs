using CardiologiaHGSM.Domain.Usuarios;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CardiologiaHGSM.Infrastructure.Identity;

/// <summary>
/// Crea los roles del sistema y, si no existe ningún administrador, el administrador inicial
/// a partir de la sección de configuración "Seed:Admin" (Email, Password, Nombre, Apellido).
/// Es idempotente: se puede ejecutar en cada arranque.
/// </summary>
public static class IdentitySeeder
{
    public static async Task SeedIdentidadAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Rol>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Usuario>>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger(typeof(IdentitySeeder));

        foreach (var nombreRol in Rol.Todos)
        {
            if (await roleManager.RoleExistsAsync(nombreRol))
                continue;

            var resultado = await roleManager.CreateAsync(Rol.Crear(nombreRol).Value);
            if (!resultado.Succeeded)
                throw new InvalidOperationException($"No se pudo crear el rol {nombreRol}: {Describir(resultado)}");
        }

        var administradores = await userManager.GetUsersInRoleAsync(Rol.Administrador);
        if (administradores.Count > 0)
            return;

        var seccion = configuration.GetSection("Seed:Admin");
        var email = seccion["Email"];
        var password = seccion["Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning(
                "No existe ningún administrador y no se configuró Seed:Admin:Email / Seed:Admin:Password. " +
                "No se podrá administrar usuarios hasta crear uno.");
            return;
        }

        var usuario = await userManager.FindByEmailAsync(email);
        if (usuario is null)
        {
            var crear = Usuario.Crear(
                seccion["Nombre"] ?? "Administrador",
                seccion["Apellido"] ?? "Sistema",
                email);

            if (crear.IsError)
                throw new InvalidOperationException($"Seed:Admin inválido: {crear.FirstError.Description}");

            usuario = crear.Value;
            var resultadoCrear = await userManager.CreateAsync(usuario, password);
            if (!resultadoCrear.Succeeded)
                throw new InvalidOperationException($"No se pudo crear el administrador inicial: {Describir(resultadoCrear)}");
        }

        var resultadoRol = await userManager.AddToRoleAsync(usuario, Rol.Administrador);
        if (!resultadoRol.Succeeded)
            throw new InvalidOperationException($"No se pudo asignar el rol Administrador: {Describir(resultadoRol)}");

        logger.LogInformation("Administrador inicial creado: {Email}", email);
    }

    private static string Describir(IdentityResult resultado) =>
        string.Join(" ", resultado.Errors.Select(e => e.Description));
}
