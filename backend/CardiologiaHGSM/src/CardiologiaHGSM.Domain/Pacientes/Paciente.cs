using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Estudios;

namespace CardiologiaHGSM.Domain.Pacientes;

public class Paciente
{
    public Guid Id { get; private set; }
    public string Nombre { get; private set; }
    public string Apellido { get; private set; }
    public string Dni { get; private set; }
    public DateTime FechaNacimiento { get; private set; }
    public string? Antecedentes { get; private set; }
    public DateTime FechaCarga { get; private set; }
    
    public int SexoId {get; private set; }

    // Navs EFCore:
    public Sexo Sexo { get; private set; }
    public IReadOnlyCollection<FactorDeRiesgo> FactoresDeRiesgo { get; private set; }
    public ICollection<Contacto> Contactos { get; private set; }
    public ICollection<Estudio> Estudios { get; private set; }

    // constructor vacío para EFCore
    private Paciente() { }

    public Paciente(string nombre, string apellido, string dni, DateTime fechaNacimiento, int sexoId, string? antecedentes = null)
    {
        this.Id = Guid.CreateVersion7();
        this.Nombre = nombre;
        this.Apellido = apellido;
        this.Dni = dni;
        this.FechaNacimiento = fechaNacimiento;
        this.SexoId = sexoId;
        this.Antecedentes = antecedentes;
        this.FechaCarga = DateTime.UtcNow;
    }
}
