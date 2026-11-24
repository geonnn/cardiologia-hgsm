using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Camas.Dtos;

public sealed record CamaDto(
    Guid Id,
    int NumeroCama,
    Manejo Sector,
    EstadoCamaTipo Estado,
    OcupanteCamaDto? Ocupante)
{
    public static CamaDto FromEntity(CamaConInternacion item, DateTime ahoraUtc)
    {
        var (cama, internacion) = item;

        return new CamaDto(
            cama.Id,
            cama.NumeroCama,
            cama.Sector,
            cama.EstadoCama.Tipo,
            internacion is null ? null : OcupanteCamaDto.FromEntity(internacion, ahoraUtc));
    }
}
