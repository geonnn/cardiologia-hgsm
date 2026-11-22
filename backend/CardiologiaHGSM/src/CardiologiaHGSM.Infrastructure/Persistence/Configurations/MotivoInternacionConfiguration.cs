using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class MotivoInternacionConfiguration : IEntityTypeConfiguration<MotivoInternacion>
{
    public void Configure(EntityTypeBuilder<MotivoInternacion> builder)
    {
        builder.Property(m => m.Nombre)
            .IsRequired()
            .HasMaxLength(MotivoInternacion.MaxLongitudNombre);

        builder.HasIndex(m => m.Nombre).IsUnique();
    }
}