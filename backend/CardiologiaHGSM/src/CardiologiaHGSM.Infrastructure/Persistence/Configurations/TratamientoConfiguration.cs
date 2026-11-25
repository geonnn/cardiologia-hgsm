using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class TratamientoConfiguration : IEntityTypeConfiguration<Tratamiento>
{
    public void Configure(EntityTypeBuilder<Tratamiento> builder)
    {
        builder.Property(t => t.Id).ValueGeneratedNever();
        
        // Relación N:1 con Internacion.
        // WithMany() va vacío porque Internacion no expone una colección de Tratamientos;
        // la navegación existe solo desde Tratamiento hacia Internacion.
        builder.HasOne(t => t.Internacion)
            .WithMany()
            .HasForeignKey(t => t.InternacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}