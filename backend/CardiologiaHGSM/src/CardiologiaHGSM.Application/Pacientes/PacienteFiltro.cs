using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Pacientes;

public sealed record PacienteFiltro(
    int Page = 1,
    int PageSize = 10,
    string? Busqueda = null,
    Sexo? Sexo = null,
    Guid? MedicoDeCabeceraId = null,
    int? FactorDeRiesgoId = null,
    int? MotivoInternacionId = null,
    bool? ConInternacionActiva = null,
    DateOnly? FechaCargaDesde = null,
    DateOnly? FechaCargaHasta = null,
    PacienteOrden OrdenarPor = PacienteOrden.Alfabetico,
    bool Descendente = false
);
