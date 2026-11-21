namespace CardiologiaHGSM.Domain.Internaciones;

public class Tratamiento
{
    public const int MaxMesesDesfasaje = 2;

    public Guid Id { get; private set; }
    public Guid InternacionId { get; private set; }
    public string Descripcion { get; private set; } = null!;
    public DateTime Fecha { get; private set; }

    private Tratamiento() { }

    public static ErrorOr<Tratamiento> Crear(Guid internacionId, string descripcion, DateTime? fecha = null)
    {
        var fechaEfectiva = fecha ?? DateTime.UtcNow;
        var errores = ValidarDatos(descripcion, fechaEfectiva);
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

    public ErrorOr<Success> Modificar(string descripcion, DateTime? fecha = null)
    {
        var errores = ValidarDatos(descripcion, fecha);
        if (errores.Count > 0)
            return errores;

        this.Descripcion = descripcion.Trim();
        if (fecha.HasValue)
            this.Fecha = fecha.Value;

        return Result.Success;
    }

    public static bool EsFechaValida(DateTime fecha, DateTime? referencia = null)
    {
        var ahora = referencia ?? DateTime.UtcNow;
        var limiteInferior = ahora.AddMonths(-MaxMesesDesfasaje);
        var limiteSuperior = ahora.AddMonths(MaxMesesDesfasaje);

        return fecha >= limiteInferior && fecha <= limiteSuperior;
    }

    private static List<Error> ValidarDatos(string descripcion, DateTime? fecha)
    {
        var errores = new List<Error>();

        if (ValidarDescripcion(descripcion) is { } errorDescripcion)
            errores.Add(errorDescripcion);

        if (fecha.HasValue && ValidarFecha(fecha.Value) is { } errorFecha)
            errores.Add(errorFecha);

        return errores;
    }

    private static Error? ValidarDescripcion(string? descripcion) =>
        string.IsNullOrWhiteSpace(descripcion) ? InternacionErrors.TratamientoDescripcionRequerida : null;

    private static Error? ValidarFecha(DateTime fecha) =>
        !EsFechaValida(fecha) ? InternacionErrors.TratamientoFechaFueraDeRango : null;
}
