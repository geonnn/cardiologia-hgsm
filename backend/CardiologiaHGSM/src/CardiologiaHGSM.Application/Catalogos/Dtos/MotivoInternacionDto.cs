using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Dtos;

public sealed record MotivoInternacionDto(
    int Id,
    string Nombre)
{
    public static MotivoInternacionDto FromEntity(MotivoInternacion motivo) => new(
        motivo.Id,
        motivo.Nombre
    );
}
