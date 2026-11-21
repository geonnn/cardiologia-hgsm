namespace CardiologiaHGSM.Domain.Pacientes;

public sealed record Dni
{
    public const int MinLongitud = 7;
    public const int MaxLongitud = 9;

    public string Valor { get; }

    private Dni(string valor)
    {
        this.Valor = valor;
    }

    public static ErrorOr<Dni> Crear(string? valor)
    {
        var normalizado = valor?.Trim().ToUpperInvariant() ?? string.Empty;

        if (string.IsNullOrEmpty(normalizado))
            return DniErrors.Requerido;

        var errores = new List<Error>();

        if (normalizado.Length is < MinLongitud or > MaxLongitud)
            errores.Add(DniErrors.LongitudInvalida);

        if (!normalizado.All(char.IsAsciiLetterOrDigit))
            errores.Add(DniErrors.FormatoInvalido);

        if (errores.Count > 0)
            return errores;

        return new Dni(normalizado);
    }

    public override string ToString() => this.Valor;
}
