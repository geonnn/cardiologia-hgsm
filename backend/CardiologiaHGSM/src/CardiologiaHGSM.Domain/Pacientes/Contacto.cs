namespace CardiologiaHGSM.Domain.Pacientes;

public class Contacto
{
    public const int MaxLongitudNombre = 50;
    public const int MaxLongitudApellido = 50;
    public const int MaxLongitudTelefono = 15;
    public const int MaxLongitudParentesco = 15;

    public Guid Id { get; private set; }
    public Guid PacienteId { get; private set; }
    public string Nombre { get; private set; } = null!;
    public string? Apellido { get; private set; }
    public string Telefono { get; private set; } = null!;
    public string? Parentesco { get; private set; }

    private Contacto() { }

    public static ErrorOr<Contacto> Crear(
        Guid pacienteId,
        string nombre,
        string telefono,
        string? apellido = null,
        string? parentesco = null)
    {
        var errores = ValidarDatos(nombre, telefono, apellido, parentesco);
        if (errores.Count > 0)
            return errores;

        return new Contacto
        {
            Id = Guid.CreateVersion7(),
            PacienteId = pacienteId,
            Nombre = nombre.Trim(),
            Telefono = telefono.Trim(),
            Apellido = NormalizarOpcional(apellido),
            Parentesco = NormalizarOpcional(parentesco)
        };
    }

    public ErrorOr<Success> Modificar(
        string nombre,
        string telefono,
        string? apellido = null,
        string? parentesco = null)
    {
        var errores = ValidarDatos(nombre, telefono, apellido, parentesco);
        if (errores.Count > 0)
            return errores;

        this.Nombre = nombre.Trim();
        this.Telefono = telefono.Trim();
        this.Apellido = NormalizarOpcional(apellido);
        this.Parentesco = NormalizarOpcional(parentesco);

        return Result.Success;
    }

    private static List<Error> ValidarDatos(string nombre, string telefono, string? apellido, string? parentesco)
    {
        var errores = new List<Error>();

        if (ValidarNombre(nombre) is { } errorNombre)
            errores.Add(errorNombre);

        if (ValidarApellido(apellido) is { } errorApellido)
            errores.Add(errorApellido);

        if (ValidarTelefono(telefono) is { } errorTelefono)
            errores.Add(errorTelefono);

        if (ValidarParentesco(parentesco) is { } errorParentesco)
            errores.Add(errorParentesco);

        return errores;
    }

    private static Error? ValidarNombre(string? nombre)
    {
        var valor = nombre?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return ContactoErrors.NombreRequerido;

        if (valor.Length > MaxLongitudNombre)
            return ContactoErrors.NombreMuyLargo;

        return null;
    }

    private static Error? ValidarApellido(string? apellido)
    {
        var valor = NormalizarOpcional(apellido);
        return valor is not null && valor.Length > MaxLongitudApellido
            ? ContactoErrors.ApellidoMuyLargo
            : null;
    }

    private static Error? ValidarTelefono(string? telefono)
    {
        var valor = telefono?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return ContactoErrors.TelefonoRequerido;

        if (valor.Length > MaxLongitudTelefono || !valor.All(char.IsAsciiDigit))
            return ContactoErrors.TelefonoInvalido;

        return null;
    }

    private static Error? ValidarParentesco(string? parentesco)
    {
        var valor = NormalizarOpcional(parentesco);
        return valor is not null && valor.Length > MaxLongitudParentesco
            ? ContactoErrors.ParentescoMuyLargo
            : null;
    }

    private static string? NormalizarOpcional(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
}
