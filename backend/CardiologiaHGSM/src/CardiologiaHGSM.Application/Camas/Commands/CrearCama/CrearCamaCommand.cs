using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Camas.Commands.CrearCama;

public sealed record CrearCamaCommand(
    int NumeroCama,
    Manejo Sector
);
