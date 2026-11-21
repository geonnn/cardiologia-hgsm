namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public sealed record DeshabilitadaState : IEstadoCama
{
    public ErrorOr<Success> Ocupar(Cama cama) => CamaErrors.Deshabilitada;

    public ErrorOr<Success> Liberar(Cama cama) => CamaErrors.Deshabilitada;

    public ErrorOr<Success> BloquearPorAislamiento(Cama cama) => CamaErrors.Deshabilitada;

    public ErrorOr<Success> Desbloquear(Cama cama) => CamaErrors.NoEstaEnAislamiento;

    public ErrorOr<Success> Deshabilitar(Cama cama) => CamaErrors.YaDeshabilitada;

    public ErrorOr<Success> Habilitar(Cama cama)
    {
        cama.EstadoCama = new DisponibleState();
        return Result.Success;
    }
}
