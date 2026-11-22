using CardiologiaHGSM.Domain.Pacientes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class EstudioConfiguration : IEntityTypeConfiguration<Estudio>
{
    public void Configure(EntityTypeBuilder<Estudio> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Titulo).HasMaxLength(Estudio.MaxLongitudTitulo);

        builder.HasOne(e => e.Paciente)
            .WithMany()
            .HasForeignKey(e => e.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.TipoEstudio)
            .WithMany()
            .HasForeignKey(e => e.TipoEstudioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}