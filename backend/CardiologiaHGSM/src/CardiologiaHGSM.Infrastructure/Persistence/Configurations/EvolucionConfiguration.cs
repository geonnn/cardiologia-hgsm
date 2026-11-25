using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class EvolucionConfiguration : IEntityTypeConfiguration<Evolucion>
{
    public void Configure(EntityTypeBuilder<Evolucion> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();

        // Relación N:1 con Internacion.
        // WithMany() va vacío porque Internacion no expone una colección de Evoluciones;
        // la navegación existe solo desde Evolucion hacia Internacion.
        builder.HasOne(e => e.Internacion)
            .WithMany()
            .HasForeignKey(e => e.InternacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}