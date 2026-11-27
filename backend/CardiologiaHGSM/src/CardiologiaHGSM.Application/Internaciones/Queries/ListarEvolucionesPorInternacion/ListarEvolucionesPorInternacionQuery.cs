namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarEvolucionesPorInternacion;

public sealed record ListarEvolucionesPorInternacionQuery(
    Guid InternacionId,
    int Page = 1,
    int PageSize = 10,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    bool Ascendente = false
);
