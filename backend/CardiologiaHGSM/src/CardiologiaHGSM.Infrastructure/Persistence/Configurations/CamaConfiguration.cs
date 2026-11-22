using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class CamaConfiguration : IEntityTypeConfiguration<Cama>
{
    public void Configure(EntityTypeBuilder<Cama> builder)
    {
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
    }

    private static string EstadoToDb(IEstadoCama estado) => estado switch
    {
        DisponibleState => "Disponible",
        OcupadaState => "Ocupada",
        EnAislamientoState => "EnAislamiento",
        DeshabilitadaState => "Deshabilitada",
        _ => throw new InvalidOperationException($"Estado no soportado: {estado.GetType().Name}")
    };

    private static IEstadoCama EstadoFromDb(string valor) => valor switch
    {
        "Disponible" => new DisponibleState(),
        "Ocupada" => new OcupadaState(),
        "EnAislamiento" => new EnAislamientoState(),
        "Deshabilitada" => new DeshabilitadaState(),
        _ => throw new InvalidOperationException($"Estado inválido en BD: {valor}")
    };
}
