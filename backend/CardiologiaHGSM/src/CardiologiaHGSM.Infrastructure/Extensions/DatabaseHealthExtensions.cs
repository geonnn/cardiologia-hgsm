using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace CardiologiaHGSM.Infrastructure.Extensions;

public static class DatabaseHealthExtensions
{
    public static async Task<bool> CanConnectToDatabaseAsync(
        this IServiceProvider services,
        CancellationToken ct = default)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CardiologiaDbContext>();
        return await dbContext.Database.CanConnectAsync(ct);
    }
}
