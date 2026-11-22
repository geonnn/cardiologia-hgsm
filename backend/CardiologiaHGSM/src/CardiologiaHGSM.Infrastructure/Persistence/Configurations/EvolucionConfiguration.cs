using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class EvolucionConfiguration : IEntityTypeConfiguration<Evolucion>
{
    public void Configure(EntityTypeBuilder<Evolucion> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.HasOne(e => e.Internacion)
            .WithMany()
            .HasForeignKey(e => e.InternacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}