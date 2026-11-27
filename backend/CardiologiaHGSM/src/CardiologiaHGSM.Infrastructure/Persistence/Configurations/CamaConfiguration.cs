using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class CamaConfiguration : IEntityTypeConfiguration<Cama>
{
    public void Configure(EntityTypeBuilder<Cama> builder)
    {
        builder.Property(c => c.Id).ValueGeneratedNever();

        builder.Property(c => c.EstadoCama)
            .HasColumnName("Estado")
            .HasMaxLength(30)
            .HasConversion(
                estado => EstadoToDb(estado),
                valor => EstadoFromDb(valor)
            );

        builder.Property(c => c.Sector)
            .HasColumnName("Sector")
            .HasMaxLength(30)
            .HasConversion<string>();

        builder.HasIndex(c => new { c.NumeroCama, c.Sector }).IsUnique();

        // Concurrencia optimista con la columna de sistema xmin de PostgreSQL (protege ocupación/cambios de estado concurrentes).
        builder.Property<uint>("xmin").IsRowVersion();
    }

    // Se persiste el nombre del estado ("Disponible", "Ocupada", "EnAislamiento", "Deshabilitada").
    private static string EstadoToDb(IEstadoCama estado) => estado.Tipo.ToString();

    private static IEstadoCama EstadoFromDb(string valor) =>
        Enum.TryParse<EstadoCamaTipo>(valor, out var tipo)
            ? EstadoCamaFactory.Crear(tipo)
            : throw new InvalidOperationException($"Estado inválido en BD: {valor}");
}
