using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class FactorDeRiesgoConfiguration : IEntityTypeConfiguration<FactorDeRiesgo>
{
    public void Configure(EntityTypeBuilder<FactorDeRiesgo> builder)
    {
        builder.Property(f => f.Nombre)
            .IsRequired()
            .HasMaxLength(FactorDeRiesgo.MaxLongitudNombre);

        builder.HasIndex(f => f.Nombre).IsUnique();
    }
}