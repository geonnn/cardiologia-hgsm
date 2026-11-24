namespace CardiologiaHGSM.Domain.Catalogos;

public class ObraSocial : ICatalogo<ObraSocial, int>
{
    public const int MaxLongitudNombre = 30;

    public int Id { get; private set; }
    public string Nombre { get; private set; } = null!;

    private ObraSocial() { }

    public static ErrorOr<ObraSocial> Crear(string nombre)
    {
        if (ValidarNombre(nombre) is { } error)
            return error;

        return new ObraSocial
        {
            Nombre = nombre.Trim()
        };
    }

    public ErrorOr<Success> Modificar(string nombre)
    {
        if (ValidarNombre(nombre) is { } error)
            return error;

        this.Nombre = nombre.Trim();
        return Result.Success;
    }

    private static Error? ValidarNombre(string? nombre)
    {
        var limpio = nombre?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(limpio))
            return CatalogoErrors.NombreRequerido;

        if (limpio.Length > MaxLongitudNombre)
            return CatalogoErrors.NombreMuyLargo(MaxLongitudNombre);

        return null;
    }
}
