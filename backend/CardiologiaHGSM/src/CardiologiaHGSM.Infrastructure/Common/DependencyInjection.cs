using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using CardiologiaHGSM.Infrastructure.Repositories;
using CardiologiaHGSM.Infrastructure.Repositories.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CardiologiaHGSM.Infrastructure.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // config EFCore con PostgreSQL
        services.AddDbContext<CardiologiaDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
        );

        // registro de servicios:
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPacienteRepository, PacienteRepository>();

        // catálogos:
        services.AddScoped<IMotivoInternacionRepository, MotivoInternacionRepository>();
        services.AddScoped<ICatalogoRepository<MotivoInternacion, int>, MotivoInternacionRepository>();

        services.AddScoped<IFactorDeRiesgoRepository, FactorDeRiesgoRepository>();
        services.AddScoped<ICatalogoRepository<FactorDeRiesgo, int>, FactorDeRiesgoRepository>();

        services.AddScoped<IObraSocialRepository, ObraSocialRepository>();
        services.AddScoped<ICatalogoRepository<ObraSocial, int>, ObraSocialRepository>();

        services.AddScoped<ITipoEstudioRepository, TipoEstudioRepository>();
        services.AddScoped<ICatalogoRepository<TipoEstudio, int>, TipoEstudioRepository>();

        services.AddScoped<IMedicoDeCabeceraRepository, MedicoDeCabeceraRepository>();
        services.AddScoped<ICatalogoRepository<MedicoDeCabecera, Guid>, MedicoDeCabeceraRepository>();

        return services;
    }
}