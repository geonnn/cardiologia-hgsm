using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarEvolucionesPorInternacion;

public class ListarEvolucionesPorInternacionHandler(
    IInternacionRepository internacionRepository,
    IEvolucionRepository evolucionRepository
) : IQueryHandler<ListarEvolucionesPorInternacionQuery, PaginatedList<EvolucionDto>>
{
    public async Task<ErrorOr<PaginatedList<EvolucionDto>>> HandleAsync(
        ListarEvolucionesPorInternacionQuery query,
        CancellationToken ct = default)
    {
        if (!await internacionRepository.ExisteAsync(query.InternacionId, ct))
            return InternacionErrors.NoEncontrada;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return InternacionErrors.RangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var evoluciones = await evolucionRepository.ListarPorInternacionAsync(
            query.InternacionId,
            page,
            pageSize,
            query.FechaDesde,
            query.FechaHasta,
            query.Ascendente,
            ct);

        return evoluciones.Map(EvolucionDto.FromEntity);
    }
}
