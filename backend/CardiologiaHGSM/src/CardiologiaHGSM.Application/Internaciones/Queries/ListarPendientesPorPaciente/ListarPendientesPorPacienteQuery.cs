namespace CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorPaciente;

public sealed record ListarPendientesPorPacienteQuery(
    Guid PacienteId,
    int Page = 1,
    int PageSize = 10,
    bool? Realizado = null,
    DateTime? FechaDesde = null,
    DateTime? FechaHasta = null,
    bool Ascendente = false
);