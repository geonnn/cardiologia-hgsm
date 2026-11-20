namespace CardiologiaHGSM.Domain.Pacientes;

public class Contacto
{
    public Guid Id { get; private set; }
    public string Nombre { get; private set; }
    public string? Apellido { get; private set; }
    public string Telefono { get; private set; }
    public string? Parentesco { get; private set; }

    private Contacto() { }

    public Contacto(string nombre, string telefono, string? apellido = null, string? parentesco = null)
    {
        this.Nombre = nombre;
        this.Telefono = telefono;
        this.Apellido = apellido;
        this.Parentesco = parentesco;
    }
}
