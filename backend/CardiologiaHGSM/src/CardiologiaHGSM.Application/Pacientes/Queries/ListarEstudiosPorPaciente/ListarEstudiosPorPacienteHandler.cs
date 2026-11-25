using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Queries.ListarEstudiosPorPaciente;

public class ListarEstudiosPorPacienteHandler(
    IPacienteRepository pacienteRepository,
    IEstudioRepository estudioRepository
) : IQueryHandler<ListarEstudiosPorPacienteQuery, PaginatedList<EstudioDto>>
{
    public async Task<ErrorOr<PaginatedList<EstudioDto>>> HandleAsync(
        ListarEstudiosPorPacienteQuery query,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(query.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return EstudioErrors.RangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var estudios = await estudioRepository.ListarPorPacienteAsync(
            query.PacienteId,
            page,
            pageSize,
            query.TipoEstudioId,
            query.FechaDesde,
            query.FechaHasta,
            ct);

        return estudios.Map(EstudioDto.FromEntity);
    }
}
