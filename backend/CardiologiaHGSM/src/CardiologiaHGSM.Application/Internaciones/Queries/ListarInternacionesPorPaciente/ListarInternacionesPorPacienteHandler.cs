using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarInternacionesPorPaciente;

public class ListarInternacionesPorPacienteHandler(
    IPacienteRepository pacienteRepository,
    IInternacionRepository internacionRepository
) : IQueryHandler<ListarInternacionesPorPacienteQuery, PaginatedList<InternacionResumenDto>>
{
    public async Task<ErrorOr<PaginatedList<InternacionResumenDto>>> HandleAsync(
        ListarInternacionesPorPacienteQuery query,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(query.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return InternacionErrors.RangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var internaciones = await internacionRepository.ListarPorPacienteAsync(
            query.PacienteId,
            page,
            pageSize,
            query.FechaDesde,
            query.FechaHasta,
            query.Ascendente,
            ct);

        return internaciones.Map(InternacionResumenDto.FromEntity);
    }
}
