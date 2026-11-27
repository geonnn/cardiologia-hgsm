using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ObtenerInternacionPorId;

public class ObtenerInternacionPorIdHandler(
    IInternacionRepository internacionRepository
) : IQueryHandler<ObtenerInternacionPorIdQuery, InternacionDetalleDto>
{
    public async Task<ErrorOr<InternacionDetalleDto>> HandleAsync(
        ObtenerInternacionPorIdQuery query,
        CancellationToken ct = default)
    {
        var internacion = await internacionRepository.ObtenerDetallePorIdAsync(query.Id, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        var hoy = DateOnly.FromDateTime(DateTime.Today);
        return InternacionDetalleDto.FromEntity(internacion, hoy);
    }
}
