using CardiologiaHGSM.Application.Catalogos.Services;
using CardiologiaHGSM.Application.Common.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CardiologiaHGSM.Application.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // registro de servicios automático:
        var assembly = typeof(DependencyInjection).Assembly;
        var handlerTypes = assembly.GetTypes()
            .Where(t => t is { IsClass: true, IsAbstract: false });
            
        foreach (var type in handlerTypes)
        {
            var interfaces = type.GetInterfaces()
                .Where(i => i.IsGenericType &&
                    (i.GetGenericTypeDefinition() == typeof(ICommandHandler<,>)
                        || i.GetGenericTypeDefinition() == typeof(ICommandHandler<>)
                        || i.GetGenericTypeDefinition() == typeof(IQueryHandler<,>)));

            foreach (var @interface in interfaces)
                services.AddScoped(@interface, type);
        }

        services.AddScoped(typeof(CatalogoService<,>));

        return services;
    }
}
