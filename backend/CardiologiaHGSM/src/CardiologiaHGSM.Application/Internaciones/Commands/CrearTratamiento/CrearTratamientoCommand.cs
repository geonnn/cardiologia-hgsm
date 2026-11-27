namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearTratamiento;

public sealed record CrearTratamientoCommand(
    Guid InternacionId,
    string Descripcion,
    DateTimeOffset? Fecha = null
);
