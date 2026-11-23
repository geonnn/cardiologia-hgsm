namespace CardiologiaHGSM.Application.Camas.Commands.CambiarEstadoCama;

public sealed record CambiarEstadoCamaCommand(
    Guid CamaId,
    AccionEstadoCama Accion
);
