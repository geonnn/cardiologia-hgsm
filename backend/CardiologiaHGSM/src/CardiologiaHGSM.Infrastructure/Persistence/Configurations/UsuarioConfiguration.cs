using CardiologiaHGSM.Domain.Usuarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.Property(u => u.Id)
            .ValueGeneratedNever();

        builder.Property(u => u.Nombre)
            .IsRequired()
            .HasMaxLength(Usuario.MaxLongitudNombre);

        builder.Property(u => u.Apellido)
            .IsRequired()
            .HasMaxLength(Usuario.MaxLongitudApellido);
    }
}
