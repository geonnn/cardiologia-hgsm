namespace CardiologiaHGSM.Application.Pacientes.Queries.ListarEstudiosPorPaciente;

public sealed record ListarEstudiosPorPacienteQuery(
    Guid PacienteId,
    int Page = 1,
    int PageSize = 10,
    int? TipoEstudioId = null,
    DateOnly? FechaDesde = null,
    DateOnly? FechaHasta = null
);
