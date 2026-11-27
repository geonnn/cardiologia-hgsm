namespace CardiologiaHGSM.Application.Internaciones.Commands.ModificarTratamiento;

public sealed record ModificarTratamientoCommand(
    Guid InternacionId,
    Guid TratamientoId,
    string Descripcion,
    DateTimeOffset? Fecha = null
);
