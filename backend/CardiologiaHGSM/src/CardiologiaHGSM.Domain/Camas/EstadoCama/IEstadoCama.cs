namespace CardiologiaHGSM.Domain.Camas.EstadoCama;

public interface IEstadoCama
{
    EstadoCamaTipo Tipo { get; }

    ErrorOr<Success> Ocupar(Cama cama);
    ErrorOr<Success> Liberar(Cama cama);
    ErrorOr<Success> BloquearPorAislamiento(Cama cama);
    ErrorOr<Success> Desbloquear(Cama cama);
    ErrorOr<Success> Deshabilitar(Cama cama);
    ErrorOr<Success> Habilitar(Cama cama);
}
