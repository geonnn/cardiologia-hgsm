using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Dtos;

public sealed record TipoEstudioDto(
    int Id,
    string Nombre)
{
    public static TipoEstudioDto FromEntity(TipoEstudio tipoEstudio) => new(
        tipoEstudio.Id,
        tipoEstudio.Nombre
    );
}
