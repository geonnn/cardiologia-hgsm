using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Dtos;

public sealed record ObraSocialDto(
    int Id,
    string Nombre)
{
    public static ObraSocialDto FromEntity(ObraSocial obraSocial) => new(
        obraSocial.Id,
        obraSocial.Nombre
    );
}
