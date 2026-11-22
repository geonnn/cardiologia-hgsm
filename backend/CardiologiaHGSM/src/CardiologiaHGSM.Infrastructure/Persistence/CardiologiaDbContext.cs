using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using CardiologiaHGSM.Domain.Usuarios;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Persistence;

public class CardiologiaDbContext : IdentityDbContext<Usuario, Rol, Guid>
{
    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<Contacto> Contactos { get; set; }
    public DbSet<Estudio> Estudios { get; set; }
    public DbSet<Evolucion> Evoluciones { get; set; }
    public DbSet<Internacion> Internaciones { get; set; }
    public DbSet<Pendiente> Pendientes { get; set; }
    public DbSet<Tratamiento> Tratamientos { get; set; }
    public DbSet<FactorDeRiesgo> FactoresDeRiesgo { get; set; }
    public DbSet<MedicoDeCabecera> MedicosDeCabecera { get; set; }
    public DbSet<MotivoInternacion> MotivosInternacion { get; set; }
    public DbSet<ObraSocial> ObrasSociales { get; set; }
    public DbSet<TipoEstudio> TiposEstudio { get; set; }
    public DbSet<Cama> Camas { get; set; }

    public CardiologiaDbContext(DbContextOptions<CardiologiaDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(CardiologiaDbContext).Assembly);
    }
}
