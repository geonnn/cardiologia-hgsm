using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Dtos;

public sealed record MedicoDeCabeceraDto(
    Guid Id,
    string Nombre)
{
    public static MedicoDeCabeceraDto FromEntity(MedicoDeCabecera medico) => new(
        medico.Id,
        medico.Nombre
    );
}
