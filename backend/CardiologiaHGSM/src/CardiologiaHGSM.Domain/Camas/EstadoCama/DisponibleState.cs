namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public sealed record DisponibleState : IEstadoCama
{
    public ErrorOr<Success> Ocupar(Cama cama)
    {
        cama.EstadoCama = new OcupadaState();
        return Result.Success;
    }

    public ErrorOr<Success> Liberar(Cama cama) => CamaErrors.YaDisponible;

    public ErrorOr<Success> BloquearPorAislamiento(Cama cama)
    {
        cama.EstadoCama = new EnAislamientoState();
        return Result.Success;
    }

    public ErrorOr<Success> Desbloquear(Cama cama) => CamaErrors.NoEstaEnAislamiento;

    public ErrorOr<Success> Deshabilitar(Cama cama)
    {
        cama.EstadoCama = new DeshabilitadaState();
        return Result.Success;
    }

    public ErrorOr<Success> Habilitar(Cama cama) => CamaErrors.NoEstaDeshabilitada;
}
