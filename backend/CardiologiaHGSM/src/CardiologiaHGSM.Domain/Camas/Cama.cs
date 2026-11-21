using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Domain.Camas;

public class Cama
{
    public Guid Id { get; private set; }
    public int NumeroCama { get; private set; }
    public IEstadoCama EstadoCama { get; internal set; } = new DisponibleState();
    public Manejo Manejo { get; private set; }

    private Cama() { }

    public static ErrorOr<Cama> Crear(int numeroCama, Manejo manejo)
    {
        if (ValidarNumeroCama(numeroCama) is { } errorNumero)
            return errorNumero;

        return new Cama
        {
            Id = Guid.CreateVersion7(),
            NumeroCama = numeroCama,
            EstadoCama = new DisponibleState(),
            Manejo = manejo
        };
    }

    public ErrorOr<Success> Ocupar() => this.EstadoCama.Ocupar(this);
    public ErrorOr<Success> Liberar() => this.EstadoCama.Liberar(this);
    public ErrorOr<Success> BloquearPorAislamiento() => this.EstadoCama.BloquearPorAislamiento(this);
    public ErrorOr<Success> Desbloquear() => this.EstadoCama.Desbloquear(this);
    public ErrorOr<Success> Deshabilitar() => this.EstadoCama.Deshabilitar(this);
    public ErrorOr<Success> Habilitar() => this.EstadoCama.Habilitar(this);

    private static Error? ValidarNumeroCama(int numeroCama) =>
        numeroCama <= 0 ? CamaErrors.NumeroInvalido : null;
}
