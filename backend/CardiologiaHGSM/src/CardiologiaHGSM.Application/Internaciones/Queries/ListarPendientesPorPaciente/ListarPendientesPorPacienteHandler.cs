using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorPaciente;

public class ListarPendientesPorPacienteHandler(
    IPacienteRepository pacienteRepository,
    IPendienteRepository pendienteRepository
) : IQueryHandler<ListarPendientesPorPacienteQuery, PaginatedList<PendienteDto>>
{
    public async Task<ErrorOr<PaginatedList<PendienteDto>>> HandleAsync(
        ListarPendientesPorPacienteQuery query,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(query.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        if (query.FechaDesde.HasValue && query.FechaHasta.HasValue && query.FechaDesde > query.FechaHasta)
            return InternacionErrors.PendienteRangoFechasInvalido;

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var pendientes = await pendienteRepository.ListarPorPacienteAsync(
            query.PacienteId,
            page,
            pageSize,
            query.Realizado,
            ComoUtc(query.FechaDesde),
            ComoUtc(query.FechaHasta),
            query.Ascendente,
            ct);

        return pendientes.Map(PendienteDto.FromEntity);
    }

    // Npgsql exige DateTimeKind.Utc para comparar contra columnas timestamptz.
    // Las fechas que llegan por query string vienen sin Kind (Unspecified).
    private static DateTime? ComoUtc(DateTime? fecha) =>
        fecha is { } f ? DateTime.SpecifyKind(f, DateTimeKind.Utc) : null;
}