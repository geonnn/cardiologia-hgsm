using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record TratamientoDto(
    Guid Id,
    Guid InternacionId,
    string Descripcion,
    DateTimeOffset Fecha,
    bool EsUltimo)
{
    public static TratamientoDto FromEntity(Tratamiento tratamiento, Guid? ultimoTratamientoId) => new(
        tratamiento.Id,
        tratamiento.InternacionId,
        tratamiento.Descripcion,
        tratamiento.Fecha,
        ultimoTratamientoId.HasValue && tratamiento.Id == ultimoTratamientoId.Value
    );
}
