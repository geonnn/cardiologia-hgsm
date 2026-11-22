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

        builder.Property(i => i.Aislamiento)
            .HasMaxLength(Internacion.MaxLongitudAislamiento);

        // Enums guardados como texto ("UCO", "Sala") en vez de números (0, 1),
        // para que la base sea legible y no se rompa si se reordena el enum.
        builder.Property(i => i.Manejo)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(i => i.CondicionAlta)
            .HasConversion<string>()
            .HasMaxLength(30);

        // Relación N:1 con Paciente (obligatoria).
        // WithMany() va vacío porque Paciente no expone una colección de Internaciones.
        // Restrict: una internación es historia clínica, no debe borrarse en cascada
        // al eliminar un paciente.
        builder.HasOne(i => i.Paciente)
            .WithMany()
            .HasForeignKey(i => i.PacienteId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación N:1 con Cama (obligatoria).
        // Restrict: no se puede eliminar una cama que tenga internaciones asociadas.
        builder.HasOne(i => i.Cama)
            .WithMany()
            .HasForeignKey(i => i.CamaId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación N:1 con el catálogo ObraSocial (opcional: ObraSocialId es int?).
        // Restrict: no se puede eliminar una obra social que esté en uso.
        builder.HasOne(i => i.ObraSocial)
            .WithMany()
            .HasForeignKey(i => i.ObraSocialId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación N:M con el catálogo MotivoInternacion mediante tabla intermedia.
        // Mismo patrón que Paciente <-> FactoresDeRiesgo.
        builder.HasMany(i => i.MotivosInternacion)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "InternacionMotivos",
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
                });
    }
}