namespace CardiologiaHGSM.Domain.Internaciones;

public class Tratamiento
{
    public const int MaxMesesDesfasaje = 2;

    public Guid Id { get; private set; }
    public Guid InternacionId { get; private set; }
    public Internacion Internacion { get; private set; } = null!;
    public string Descripcion { get; private set; } = null!;
    public DateTimeOffset Fecha { get; private set; }

    private Tratamiento() { }

    public static ErrorOr<Tratamiento> Crear(
        Guid internacionId,
        string descripcion,
        DateTimeOffset? fecha = null,
        DateTimeOffset? ahora = null)
    {
        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaEfectiva = (fecha ?? referencia).ToUniversalTime();
        var errores = ValidarDatos(descripcion, fechaEfectiva, referencia);
        if (errores.Count > 0)
            return errores;

        return new Tratamiento
        {
            Id = Guid.CreateVersion7(),
            InternacionId = internacionId,
            Descripcion = descripcion.Trim(),
            Fecha = fechaEfectiva
        };
    }

    public ErrorOr<Success> Modificar(
        string descripcion,
        DateTimeOffset? fecha = null,
        DateTimeOffset? ahora = null)
    {
        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaUtc = fecha?.ToUniversalTime();
        var errores = ValidarDatos(descripcion, fechaUtc, referencia);
        if (errores.Count > 0)
            return errores;

        this.Descripcion = descripcion.Trim();
        if (fechaUtc.HasValue)
            this.Fecha = fechaUtc.Value;

        return Result.Success;
    }

    public static bool EsFechaValida(DateTimeOffset fecha, DateTimeOffset? referencia = null)
    {
        var ahora = (referencia ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var limiteInferior = ahora.AddMonths(-MaxMesesDesfasaje);
        var limiteSuperior = ahora.AddMonths(MaxMesesDesfasaje);

        return fecha >= limiteInferior && fecha <= limiteSuperior;
    }

    private static List<Error> ValidarDatos(string descripcion, DateTimeOffset? fecha, DateTimeOffset ahora)
    {
        var errores = new List<Error>();

        if (ValidarDescripcion(descripcion) is { } errorDescripcion)
            errores.Add(errorDescripcion);

        if (fecha.HasValue && ValidarFecha(fecha.Value, ahora) is { } errorFecha)
            errores.Add(errorFecha);

        return errores;
    }

    private static Error? ValidarDescripcion(string? descripcion) =>
        string.IsNullOrWhiteSpace(descripcion) ? InternacionErrors.TratamientoDescripcionRequerida : null;

    private static Error? ValidarFecha(DateTimeOffset fecha, DateTimeOffset ahora) =>
        !EsFechaValida(fecha, ahora) ? InternacionErrors.TratamientoFechaFueraDeRango : null;
}
