using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class ObraSocialConfiguration : IEntityTypeConfiguration<ObraSocial>
{
    public void Configure(EntityTypeBuilder<ObraSocial> builder)
    {
        builder.Property(o => o.Nombre)
            .IsRequired()
            .HasMaxLength(ObraSocial.MaxLongitudNombre);

        builder.HasIndex(o => o.Nombre).IsUnique();
    }
}