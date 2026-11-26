using CardiologiaHGSM.Infrastructure.Extensions;

namespace CardiologiaHGSM.WebApi.Cli;

public static class CliCommands
{
    // El orden define la secuencia de ejecución si se combinan flags (ej: --migrate --seed)
    private static readonly (string Flag, Func<WebApplication, Task> Action)[] Commands =
    [
        ("--migrate", app => app.Services.ApplyMigrationsAsync()),
    ];

    private static readonly HashSet<string> KnownFlags =
        Commands.Select(c => c.Flag).ToHashSet(StringComparer.Ordinal);

    public static string[] StripFromArgs(string[] args) =>
        args.Where(a => !KnownFlags.Contains(a)).ToArray();

    public static async Task<bool> TryRunCliCommandsAsync(this WebApplication app, string[] args)
    {
        var executed = false;

        foreach (var (flag, action) in Commands)
        {
            if (!args.Contains(flag, StringComparer.Ordinal))
                continue;

            await action(app);
            executed = true;
        }

        return executed;
    }
}
