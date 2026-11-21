namespace CardiologiaHGSM.Domain.Internaciones;

public class Evolucion
{
    public Guid Id { get; private set; }
    public Guid InternacionId { get; private set; }
    public string Detalle { get; private set; } = null!;
    public DateTime Fecha { get; private set; }

    private Evolucion() { }

    public static ErrorOr<Evolucion> Crear(Guid internacionId, string detalle, DateTime fecha)
    {
        var errores = ValidarDatos(detalle, fecha);
        if (errores.Count > 0)
            return errores;

        return new Evolucion
        {
            Id = Guid.CreateVersion7(),
            InternacionId = internacionId,
            Detalle = detalle.Trim(),
            Fecha = fecha
        };
    }

    private static List<Error> ValidarDatos(string detalle, DateTime fecha)
    {
        var errores = new List<Error>();

        if (ValidarDetalle(detalle) is { } errorDetalle)
            errores.Add(errorDetalle);

        if (ValidarFecha(fecha) is { } errorFecha)
            errores.Add(errorFecha);

        return errores;
    }

    private static Error? ValidarDetalle(string? detalle) =>
        string.IsNullOrWhiteSpace(detalle) ? InternacionErrors.EvolucionDetalleRequerido : null;

    private static Error? ValidarFecha(DateTime fecha) =>
        fecha > DateTime.UtcNow ? InternacionErrors.EvolucionFechaFutura : null;
}
