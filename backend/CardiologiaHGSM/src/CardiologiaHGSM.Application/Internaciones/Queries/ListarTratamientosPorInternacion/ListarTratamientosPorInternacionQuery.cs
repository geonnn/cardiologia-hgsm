namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarTratamientosPorInternacion;

public sealed record ListarTratamientosPorInternacionQuery(
    Guid InternacionId,
    int Page = 1,
    int PageSize = 10,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    bool Ascendente = false
);
