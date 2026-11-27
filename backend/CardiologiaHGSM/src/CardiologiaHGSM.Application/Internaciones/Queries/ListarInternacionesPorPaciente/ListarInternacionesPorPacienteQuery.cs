namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarInternacionesPorPaciente;

public sealed record ListarInternacionesPorPacienteQuery(
    Guid PacienteId,
    int Page = 1,
    int PageSize = 10,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null,
    bool Ascendente = false
);
