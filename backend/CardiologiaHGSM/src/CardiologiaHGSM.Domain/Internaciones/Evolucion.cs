namespace CardiologiaHGSM.Domain.Internaciones;

public class Evolucion
{
    public Guid Id { get; private set; }
    public Guid InternacionId { get; private set; }
    public Internacion Internacion { get; private set; } = null!;
    public string Detalle { get; private set; } = null!;
    public DateTimeOffset Fecha { get; private set; }

    private Evolucion() { }

    public static ErrorOr<Evolucion> Crear(
        Guid internacionId,
        string detalle,
        DateTimeOffset fecha,
        DateTimeOffset? ahora = null)
    {
        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaUtc = fecha.ToUniversalTime();
        var errores = ValidarDatos(detalle, fechaUtc, referencia);
        if (errores.Count > 0)
            return errores;

        return new Evolucion
        {
            Id = Guid.CreateVersion7(),
            InternacionId = internacionId,
            Detalle = detalle.Trim(),
            Fecha = fechaUtc
        };
    }

    private static List<Error> ValidarDatos(string detalle, DateTimeOffset fecha, DateTimeOffset ahora)
    {
        var errores = new List<Error>();

        if (ValidarDetalle(detalle) is { } errorDetalle)
            errores.Add(errorDetalle);

        if (ValidarFecha(fecha, ahora) is { } errorFecha)
            errores.Add(errorFecha);

        return errores;
    }

    private static Error? ValidarDetalle(string? detalle) =>
        string.IsNullOrWhiteSpace(detalle) ? InternacionErrors.EvolucionDetalleRequerido : null;

    private static Error? ValidarFecha(DateTimeOffset fecha, DateTimeOffset ahora) =>
        fecha > ahora ? InternacionErrors.EvolucionFechaFutura : null;
}
