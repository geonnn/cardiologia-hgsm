using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Application.Internaciones.Commands.RegistrarAlta;

public sealed record RegistrarAltaCommand(
    Guid InternacionId,
    CondicionAlta CondicionAlta,
    DateTimeOffset FechaFin
);
