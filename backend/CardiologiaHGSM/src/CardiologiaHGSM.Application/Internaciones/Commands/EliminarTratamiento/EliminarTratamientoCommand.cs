namespace CardiologiaHGSM.Application.Internaciones.Commands.EliminarTratamiento;

public sealed record EliminarTratamientoCommand(
    Guid InternacionId,
    Guid TratamientoId
);
