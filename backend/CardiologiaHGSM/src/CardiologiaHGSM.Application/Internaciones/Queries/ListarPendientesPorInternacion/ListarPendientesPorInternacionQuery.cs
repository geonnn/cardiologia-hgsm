namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorInternacion;

public sealed record ListarPendientesPorInternacionQuery(
    Guid InternacionId,
    int Page = 1,
    int PageSize = 10,
    bool? Realizado = null,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    bool Ascendente = false
);
