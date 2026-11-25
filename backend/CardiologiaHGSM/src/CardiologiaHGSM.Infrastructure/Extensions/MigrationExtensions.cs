using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CardiologiaHGSM.Infrastructure.Extensions;

public static class MigrationExtensions
{
    public static async Task ApplyMigrationsAsync(
        this IServiceProvider services,
        CancellationToken ct = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CardiologiaDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<CardiologiaDbContext>>();

        logger.LogInformation("Verificando y aplicando migraciones pendientes...");
        await dbContext.Database.MigrateAsync(ct);
        logger.LogInformation("Base de datos actualizada correctamente.");
    }
}
