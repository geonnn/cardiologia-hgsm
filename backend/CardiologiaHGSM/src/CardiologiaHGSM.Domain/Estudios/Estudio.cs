namespace CardiologiaHGSM.Domain.Estudios;

public class Estudio
{
    public Guid Id { get; private init; }
    public TipoEstudio TipoEstudio { get; private set; }
    public DateTime Fecha { get; private set; }
    public string Descripcion { get; private set; }

    private Estudio() { }

    public Estudio(TipoEstudio tipoEstudio, DateTime fecha, string descripcion)
    {
        this.Id = Guid.CreateVersion7();
        this.TipoEstudio = tipoEstudio;
        this.Fecha = fecha;
        this.Descripcion = descripcion;
    }
}