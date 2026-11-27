using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record InternacionCamaDto(
    Guid Id,
    int NumeroCama,
    Manejo Sector,
    EstadoCamaTipo Estado)
{
    public static InternacionCamaDto FromEntity(Cama cama) => new(
        cama.Id,
        cama.NumeroCama,
        cama.Sector,
        cama.EstadoCama.Tipo);
}
