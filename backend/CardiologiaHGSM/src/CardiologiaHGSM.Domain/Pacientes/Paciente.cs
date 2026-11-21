using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Domain.Pacientes;

public class Paciente
{
    public const int MaxLongitudNombre = 50;
    public const int MaxLongitudApellido = 50;
    public const int MaxContactos = 5;

    public Guid Id { get; private set; }
    public string Nombre { get; private set; } = null!;
    public string Apellido { get; private set; } = null!;
    public Dni Dni { get; private set; } = null!;
    public DateTime FechaNacimiento { get; private set; }
    public Sexo Sexo { get; private set; }
    public string? Antecedentes { get; private set; }
    public DateTime FechaCarga { get; private set; }

    public MedicoDeCabecera? MedicoDeCabecera { get; private set; }
    public Guid? MedicoDeCabeceraId { get; private set; }

    private readonly List<FactorDeRiesgo> _factoresDeRiesgo = [];
    public IReadOnlyCollection<FactorDeRiesgo> FactoresDeRiesgo => _factoresDeRiesgo.AsReadOnly();

    private readonly List<Contacto> _contactos = [];
    public IReadOnlyCollection<Contacto> Contactos => _contactos.AsReadOnly();

    private Paciente() { }

    public static ErrorOr<Paciente> Crear(
        string nombre,
        string apellido,
        Dni dni,
        DateTime fechaNacimiento,
        Sexo sexo,
        string? antecedentes = null,
        Guid? medicoDeCabeceraId = null)
    {
        var errores = ValidarDatosPersonales(nombre, apellido, fechaNacimiento);
        if (errores.Count > 0)
            return errores;

        return new Paciente
        {
            Id = Guid.CreateVersion7(),
            Nombre = nombre.Trim(),
            Apellido = apellido.Trim(),
            Dni = dni,
            FechaNacimiento = fechaNacimiento,
            Sexo = sexo,
            Antecedentes = antecedentes,
            MedicoDeCabeceraId = medicoDeCabeceraId,
            FechaCarga = DateTime.UtcNow
        };
    }

    public int CalcularEdad(DateTime? fechaReferencia = null)
    {
        var hoy = (fechaReferencia ?? DateTime.UtcNow).Date;
        var nacimiento = this.FechaNacimiento.Date;
        var edad = hoy.Year - nacimiento.Year;

        if (nacimiento > hoy.AddYears(-edad))
            edad--;

        return Math.Max(0, edad);
    }

    public ErrorOr<Success> ModificarDatos(
        string nombre,
        string apellido,
        Dni dni,
        DateTime fechaNacimiento,
        Sexo sexo,
        string? antecedentes = null,
        Guid? medicoDeCabeceraId = null)
    {
        var errores = ValidarDatosPersonales(nombre, apellido, fechaNacimiento);
        if (errores.Count > 0)
            return errores;

        this.Nombre = nombre.Trim();
        this.Apellido = apellido.Trim();
        this.Dni = dni;
        this.FechaNacimiento = fechaNacimiento;
        this.Sexo = sexo;
        this.Antecedentes = antecedentes;
        this.MedicoDeCabeceraId = medicoDeCabeceraId;

        return Result.Success;
    }

    public ErrorOr<Success> AgregarContacto(Contacto contacto)
    {
        if (_contactos.Count >= MaxContactos)
            return PacienteErrors.MaximoContactosAlcanzado;

        _contactos.Add(contacto);
        return Result.Success;
    }

    public ErrorOr<Success> EliminarContacto(Guid contactoId)
    {
        var contacto = _contactos.FirstOrDefault(c => c.Id == contactoId);
        if (contacto is null)
            return PacienteErrors.ContactoNoEncontrado;

        _contactos.Remove(contacto);
        return Result.Success;
    }

    public ErrorOr<Success> AgregarFactorDeRiesgo(FactorDeRiesgo factor)
    {
        if (_factoresDeRiesgo.Any(f => f.Id == factor.Id && factor.Id != 0))
            return PacienteErrors.FactorDeRiesgoDuplicado;

        _factoresDeRiesgo.Add(factor);
        return Result.Success;
    }

    public ErrorOr<Success> EliminarFactorDeRiesgo(int factorDeRiesgoId)
    {
        var factor = _factoresDeRiesgo.FirstOrDefault(f => f.Id == factorDeRiesgoId);
        if (factor is null)
            return PacienteErrors.FactorDeRiesgoNoEncontrado;

        _factoresDeRiesgo.Remove(factor);
        return Result.Success;
    }

    public void ReemplazarFactoresDeRiesgo(IReadOnlyCollection<FactorDeRiesgo> factores)
    {
        _factoresDeRiesgo.Clear();
        _factoresDeRiesgo.AddRange(factores);
    }

    private static List<Error> ValidarDatosPersonales(string nombre, string apellido, DateTime fechaNacimiento)
    {
        var errores = new List<Error>();

        if (ValidarNombre(nombre) is { } errorNombre)
            errores.Add(errorNombre);

        if (ValidarApellido(apellido) is { } errorApellido)
            errores.Add(errorApellido);

        if (ValidarFechaNacimiento(fechaNacimiento) is { } errorFecha)
            errores.Add(errorFecha);

        return errores;
    }

    private static Error? ValidarNombre(string? nombre)
    {
        var valor = nombre?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return PacienteErrors.NombreRequerido;

        if (valor.Length > MaxLongitudNombre)
            return PacienteErrors.NombreMuyLargo;

        return null;
    }

    private static Error? ValidarApellido(string? apellido)
    {
        var valor = apellido?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return PacienteErrors.ApellidoRequerido;

        if (valor.Length > MaxLongitudApellido)
            return PacienteErrors.ApellidoMuyLargo;

        return null;
    }

    private static Error? ValidarFechaNacimiento(DateTime fechaNacimiento) =>
        fechaNacimiento.Date > DateTime.UtcNow.Date
            ? PacienteErrors.FechaNacimientoFutura
            : null;
}
