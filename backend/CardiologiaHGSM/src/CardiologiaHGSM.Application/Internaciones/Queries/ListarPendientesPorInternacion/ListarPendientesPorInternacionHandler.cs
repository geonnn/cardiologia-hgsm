using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorInternacion;

public class ListarPendientesPorInternacionHandler(
    IInternacionRepository internacionRepository,
    IPendienteRepository pendienteRepository
) : IQueryHandler<ListarPendientesPorInternacionQuery, PaginatedList<PendienteDto>>
{
    public async Task<ErrorOr<PaginatedList<PendienteDto>>> HandleAsync(
        ListarPendientesPorInternacionQuery query,
        CancellationToken ct = default)
    {
        if (!await internacionRepository.ExisteAsync(query.InternacionId, ct))
            return InternacionErrors.NoEncontrada;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return InternacionErrors.PendienteRangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var pendientes = await pendienteRepository.ListarPorInternacionAsync(
            query.InternacionId,
            page,
            pageSize,
            query.Realizado,
            query.FechaDesde,
            query.FechaHasta,
            query.Ascendente,
            ct);

        return pendientes.Map(PendienteDto.FromEntity);
    }
}
