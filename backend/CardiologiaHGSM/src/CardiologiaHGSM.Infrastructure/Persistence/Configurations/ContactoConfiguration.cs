using CardiologiaHGSM.Domain.Pacientes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class ContactoConfiguration : IEntityTypeConfiguration<Contacto>
{
    public void Configure(EntityTypeBuilder<Contacto> builder)
    {
        builder.Property(c => c.Id).ValueGeneratedNever();

        builder.Property(c => c.Nombre).HasMaxLength(Contacto.MaxLongitudNombre);
        builder.Property(c => c.Apellido).HasMaxLength(Contacto.MaxLongitudApellido);
        builder.Property(c => c.Telefono).HasMaxLength(Contacto.MaxLongitudTelefono);
        builder.Property(c => c.Parentesco).HasMaxLength(Contacto.MaxLongitudParentesco);

        // Contacto no tiene propiedad "Paciente", pero Paciente sí tiene la lista "Contactos"
        builder.HasOne<Paciente>()
            .WithMany(p => p.Contactos)
            .HasForeignKey(c => c.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}