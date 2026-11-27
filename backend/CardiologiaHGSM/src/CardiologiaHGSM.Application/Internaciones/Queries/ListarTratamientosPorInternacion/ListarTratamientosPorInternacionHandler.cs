using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Domain.Internaciones;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarTratamientosPorInternacion;

public class ListarTratamientosPorInternacionHandler(
    IInternacionRepository internacionRepository,
    ITratamientoRepository tratamientoRepository
) : IQueryHandler<ListarTratamientosPorInternacionQuery, PaginatedList<TratamientoDto>>
{
    public async Task<ErrorOr<PaginatedList<TratamientoDto>>> HandleAsync(
        ListarTratamientosPorInternacionQuery query,
        CancellationToken ct = default)
    {
        if (!await internacionRepository.ExisteAsync(query.InternacionId, ct))
            return InternacionErrors.NoEncontrada;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return InternacionErrors.RangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var ultimoId = await tratamientoRepository.ObtenerUltimoIdAsync(query.InternacionId, ct);
        var tratamientos = await tratamientoRepository.ListarPorInternacionAsync(
            query.InternacionId,
            page,
            pageSize,
            query.FechaDesde,
            query.FechaHasta,
            query.Ascendente,
            ct);

        return tratamientos.Map(t => TratamientoDto.FromEntity(t, ultimoId));
    }
}
