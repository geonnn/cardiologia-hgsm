using CardiologiaHGSM.Infrastructure.Persistence;
using CardiologiaHGSM.Infrastructure.Persistence.Seeding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CardiologiaHGSM.Infrastructure.Extensions;

public static class DemoSeedExtensions
{
    public static async Task ApplyDemoSeedAsync(
        this IServiceProvider services,
        CancellationToken ct = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CardiologiaDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DemoSeed>>();

        await new DemoSeed(dbContext, logger).EjecutarAsync(DateTimeOffset.UtcNow, ct);
    }
}
