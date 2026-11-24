using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Dtos;

public sealed record FactorDeRiesgoDto(
    int Id,
    string Nombre)
{
    public static FactorDeRiesgoDto FromEntity(FactorDeRiesgo factor) => new(
        factor.Id,
        factor.Nombre
    );
}
