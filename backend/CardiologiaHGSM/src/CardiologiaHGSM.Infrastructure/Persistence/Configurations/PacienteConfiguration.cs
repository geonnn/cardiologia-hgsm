using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Pacientes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class PacienteConfiguration : IEntityTypeConfiguration<Paciente>
{
    public void Configure(EntityTypeBuilder<Paciente> builder)
    {
        builder.Property(p => p.Id).ValueGeneratedNever();

        builder.Property(p => p.Dni)
            .HasColumnName("Dni")
            .HasMaxLength(Dni.MaxLongitud)
            .HasConversion(
                dniObjeto => dniObjeto.Valor,
                dniString => DniFromDb(dniString)
            );

        builder.HasIndex(p => p.Dni).IsUnique();

        builder.Property(p => p.Nombre)
            .HasMaxLength(Paciente.MaxLongitudNombre);
        
        builder.Property(p => p.Apellido)
            .HasMaxLength(Paciente.MaxLongitudApellido);

        builder.Property(p => p.Sexo)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(p => p.MedicoDeCabecera)
            .WithMany()
            .HasForeignKey(p => p.MedicoDeCabeceraId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.FactoresDeRiesgo)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "PacienteFactoresDeRiesgo",
                right => right.HasOne<FactorDeRiesgo>()
                    .WithMany()
                    .HasForeignKey("FactorDeRiesgoId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left.HasOne<Paciente>()
                    .WithMany()
                    .HasForeignKey("PacienteId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.HasKey("PacienteId", "FactorDeRiesgoId");
                });
    }

    private static Dni DniFromDb(string dni)
    {
        var result = Dni.Crear(dni);
        if (result.IsError)
            throw new InvalidOperationException($"DNI inválido en BD: {dni}");
        
        return result.Value;
    }
}
