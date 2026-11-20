using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Domain.Camas;

public class Cama
{
    public Guid Id { get; private set; }
    public int NumeroCama { get; private set; }
    public int EstadoCamaId { get; private set; }
    public int ManejoId { get; private set; }

    public EstadoCama EstadoCama { get; private set; }
    public Manejo Manejo { get; private set; }

    private Cama() { }

    public Cama(int numeroCama, int manejoId)
    {
        this.Id = Guid.CreateVersion7();
        this.NumeroCama = numeroCama;
        this.EstadoCamaId = 
        this.ManejoId = manejoId;
    }
}
