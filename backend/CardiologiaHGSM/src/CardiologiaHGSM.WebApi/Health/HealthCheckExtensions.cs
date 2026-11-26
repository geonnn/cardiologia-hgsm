using System.Text.Json;
using CardiologiaHGSM.Infrastructure.Extensions;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace CardiologiaHGSM.WebApi.Health;

public static class HealthCheckExtensions
{
    public static IServiceCollection AddApiHealthChecks(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck<DatabaseHealthCheck>("database");

        return services;
    }

    public static IEndpointConventionBuilder MapApiHealthChecks(this WebApplication app) =>
        app.MapHealthChecks("/api/health", new HealthCheckOptions
        {
            ResponseWriter = WriteJsonResponseAsync
        }).AllowAnonymous();

    private static Task WriteJsonResponseAsync(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        var payload = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.ToDictionary(
                entry => entry.Key,
                entry => entry.Value.Status.ToString())
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }

    private sealed class DatabaseHealthCheck(IServiceProvider services) : IHealthCheck
    {
        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken ct = default)
        {
            var canConnect = await services.CanConnectToDatabaseAsync(ct);

            return canConnect
                ? HealthCheckResult.Healthy()
                : HealthCheckResult.Unhealthy("No se pudo conectar a la base de datos.");
        }
    }
}
