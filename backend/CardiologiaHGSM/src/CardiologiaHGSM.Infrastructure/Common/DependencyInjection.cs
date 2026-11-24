using CardiologiaHGSM.Application.Camas;
using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Application.Usuarios;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Usuarios;
using CardiologiaHGSM.Infrastructure.Identity;
using CardiologiaHGSM.Infrastructure.Persistence;
using CardiologiaHGSM.Infrastructure.Repositories;
using CardiologiaHGSM.Infrastructure.Repositories.Catalogos;
using Microsoft.AspNetCore.Identity;
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
        services.AddScoped<ICamaRepository, CamaRepository>();
        services.AddScoped<IEstudioRepository, EstudioRepository>();

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

        services.AddIdentidad();

        return services;
    }

    private static IServiceCollection AddIdentidad(this IServiceCollection services)
    {
        services
            .AddIdentityCore<Usuario>(options =>
            {
                // RF-02: mínimo 6, una minúscula y un número (el máximo de 12 lo valida PasswordLongitudMaximaValidator)
                options.Password.RequiredLength = Usuario.MinLongitudPassword;
                options.Password.RequireLowercase = true;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredUniqueChars = 1;

                options.User.RequireUniqueEmail = true;

                // protección contra fuerza bruta: 5 intentos fallidos bloquean la cuenta 5 minutos
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            })
            .AddRoles<Rol>()
            .AddEntityFrameworkStores<CardiologiaDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders()
            .AddErrorDescriber<IdentityErrorDescriberEs>()
            .AddPasswordValidator<PasswordLongitudMaximaValidator>();

        services.AddScoped<ISesionService, SesionService>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        return services;
    }
}
