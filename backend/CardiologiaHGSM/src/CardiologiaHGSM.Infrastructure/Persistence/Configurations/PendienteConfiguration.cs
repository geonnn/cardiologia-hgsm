using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class PendienteConfiguration : IEntityTypeConfiguration<Pendiente>
{
    public void Configure(EntityTypeBuilder<Pendiente> builder)
    {
        builder.Property(p => p.Id).ValueGeneratedNever();

        builder.Property(p => p.Titulo).HasMaxLength(Pendiente.MaxLongitudTitulo);

        // Relación N:1 con Internacion.
        // WithMany() va vacío porque Internacion no expone una colección de Pendientes;
        // la navegación existe solo desde Pendiente hacia Internacion.
        builder.HasOne(p => p.Internacion)
            .WithMany()
            .HasForeignKey(p => p.InternacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}