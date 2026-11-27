namespace CardiologiaHGSM.Application.Internaciones.Commands.CrearEvolucion;

public sealed record CrearEvolucionCommand(
    Guid InternacionId,
    string Detalle,
    DateTimeOffset Fecha
);
