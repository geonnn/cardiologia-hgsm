namespace CardiologiaHGSM.Domain.Catalogos;

public class MedicoDeCabecera
{
    public const int MaxLongitudNombre = 100;

    public Guid Id { get; private set; }
    public string Nombre { get; private set; } = null!;

    private MedicoDeCabecera() { }

    public static ErrorOr<MedicoDeCabecera> Crear(string nombre)
    {
        if (ValidarNombre(nombre) is { } error)
            return error;

        return new MedicoDeCabecera
        {
            Id = Guid.CreateVersion7(),
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
