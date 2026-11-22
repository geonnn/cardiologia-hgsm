using CardiologiaHGSM.Domain.Internaciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CardiologiaHGSM.Infrastructure.Persistence.Configurations;

public class TratamientoConfiguration : IEntityTypeConfiguration<Tratamiento>
{
    public void Configure(EntityTypeBuilder<Tratamiento> builder)
    {
        builder.Property(t => t.Id).ValueGeneratedNever();

        builder.HasOne(t => t.Internacion)
            .WithMany()
            .HasForeignKey(t => t.InternacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}