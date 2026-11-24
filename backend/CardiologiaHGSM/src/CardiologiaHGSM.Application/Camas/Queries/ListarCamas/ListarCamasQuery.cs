using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Camas.Queries.ListarCamas;

public sealed record ListarCamasQuery(
    Manejo? Sector = null,
    EstadoCamaTipo? Estado = null
);
