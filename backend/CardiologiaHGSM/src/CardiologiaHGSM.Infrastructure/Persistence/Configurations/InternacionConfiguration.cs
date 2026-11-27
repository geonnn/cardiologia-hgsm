using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class InternacionConfiguration : IEntityTypeConfiguration<Internacion>
{
    public void Configure(EntityTypeBuilder<Internacion> builder)
    {
        builder.Property(i => i.Id).ValueGeneratedNever();

        builder.Property(i => i.Manejo)
            .HasMaxLength(30)
            .HasConversion<string>();

        builder.Property(i => i.CondicionAlta)
            .HasMaxLength(30)
            .HasConversion<string>();

        builder.Property(i => i.Aislamiento)
            .HasMaxLength(Internacion.MaxLongitudAislamiento);
        
        builder.HasIndex(i => new { i.PacienteId, i.FechaInternacion })
            .IsUnique();

        builder.HasIndex(i => i.PacienteId, "IX_Internaciones_PacienteId_Activa")
            .IsUnique()
            .HasFilter("\"FechaFin\" IS NULL");

        // builder.HasIndex(i => i.CamaId, "IX_Internaciones_CamaId_Activa")
        //     .IsUnique()
        //     .HasFilter("\"FechaFin\" IS NULL");
        // No se define índice único sobre CamaId activa para permitir el intercambio de camas
        // (swap, RF-49) en memoria dentro de SaveChangesAsync; la ocupación concurrente se
        // resguarda mediante concurrencia optimista (xmin) sobre Cama y las reglas de aplicación.

        builder.HasOne(i => i.Paciente)
            .WithMany()
            .HasForeignKey(i => i.PacienteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Cama)
            .WithMany()
            .HasForeignKey(i => i.CamaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.ObraSocial)
            .WithMany()
            .HasForeignKey(i => i.ObraSocialId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(i => i.MotivosInternacion)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "InternacionMotivosInternacion",
                right => right.HasOne<MotivoInternacion>()
                    .WithMany()
                    .HasForeignKey("MotivoInternacionId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left.HasOne<Internacion>()
                    .WithMany()
                    .HasForeignKey("InternacionId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.HasKey("InternacionId", "MotivoInternacionId");
                }
            );

        // Concurrencia optimista con la columna de sistema xmin de PostgreSQL (protege modificaciones y swaps concurrentes).
        builder.Property<uint>("xmin").IsRowVersion();
    }
}
