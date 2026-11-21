namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public sealed record EnAislamientoState : IEstadoCama
{
    public ErrorOr<Success> Ocupar(Cama cama) => CamaErrors.EnAislamiento;

    public ErrorOr<Success> Liberar(Cama cama) => CamaErrors.EnAislamiento;

    public ErrorOr<Success> BloquearPorAislamiento(Cama cama) => CamaErrors.YaEnAislamiento;

    public ErrorOr<Success> Desbloquear(Cama cama)
    {
        cama.EstadoCama = new DisponibleState();
        return Result.Success;
    }

    public ErrorOr<Success> Deshabilitar(Cama cama) => CamaErrors.EnAislamiento;

    public ErrorOr<Success> Habilitar(Cama cama) => CamaErrors.NoEstaDeshabilitada;
}
