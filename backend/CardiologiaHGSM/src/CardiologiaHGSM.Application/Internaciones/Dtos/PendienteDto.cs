using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones.Dtos;

public sealed record PendienteDto(
    Guid Id,
    Guid InternacionId,
    string Titulo,
    string Descripcion,
    DateTime FechaCarga,
    DateTime? FechaResolucion,
    bool EstaRealizado)
{
    public static PendienteDto FromEntity(Pendiente pendiente) => new(
        pendiente.Id,
        pendiente.InternacionId,
        pendiente.Titulo,
        pendiente.Descripcion,
        pendiente.FechaCarga,
        pendiente.FechaResolucion,
        pendiente.EstaRealizado
    );
}