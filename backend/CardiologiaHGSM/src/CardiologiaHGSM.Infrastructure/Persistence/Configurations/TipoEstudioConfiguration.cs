using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class TipoEstudioConfiguration : IEntityTypeConfiguration<TipoEstudio>
{
    public void Configure(EntityTypeBuilder<TipoEstudio> builder)
    {
        builder.Property(t => t.Nombre)
            .IsRequired()
            .HasMaxLength(TipoEstudio.MaxLongitudNombre);

        builder.HasIndex(t => t.Nombre).IsUnique();
    }
}