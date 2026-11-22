using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class MedicoDeCabeceraConfiguration : IEntityTypeConfiguration<MedicoDeCabecera>
{
    public void Configure(EntityTypeBuilder<MedicoDeCabecera> builder)
    {
        builder.Property(m => m.Id)
            .ValueGeneratedNever(); // Esto dice: El ID lo genera el Dominio

        builder.Property(m => m.Nombre)
            .IsRequired()
            .HasMaxLength(MedicoDeCabecera.MaxLongitudNombre);

        builder.HasIndex(m => m.Nombre).IsUnique();
    }
}