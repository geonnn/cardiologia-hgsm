namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public sealed record OcupadaState : IEstadoCama
{
    public EstadoCamaTipo Tipo => EstadoCamaTipo.Ocupada;

    public ErrorOr<Success> Ocupar(Cama cama) => CamaErrors.YaOcupada;

    public ErrorOr<Success> Liberar(Cama cama)
    {
        cama.EstadoCama = new DisponibleState();
        return Result.Success;
    }

    public ErrorOr<Success> BloquearPorAislamiento(Cama cama) => CamaErrors.YaOcupada;

    public ErrorOr<Success> Desbloquear(Cama cama) => CamaErrors.NoEstaEnAislamiento;

    public ErrorOr<Success> Deshabilitar(Cama cama) => CamaErrors.YaOcupada;

    public ErrorOr<Success> Habilitar(Cama cama) => CamaErrors.NoEstaDeshabilitada;
}
