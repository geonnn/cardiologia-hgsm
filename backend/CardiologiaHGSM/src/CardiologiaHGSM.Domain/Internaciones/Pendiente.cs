namespace CardiologiaHGSM.Domain.Internaciones;

public class Pendiente
{
    public const int MaxLongitudTitulo = 32;

    public Guid Id { get; private set; }
    public Guid InternacionId { get; private set; }
    public Internacion Internacion { get; private set; } = null!;
    public string Titulo { get; private set; } = null!;
    public string Descripcion { get; private set; } = null!;
    public DateTimeOffset FechaCarga { get; private set; }
    public DateTimeOffset? FechaResolucion { get; private set; }

    public bool EstaRealizado => this.FechaResolucion is not null;

    private Pendiente() { }

    public static ErrorOr<Pendiente> Crear(
        Guid internacionId,
        string titulo,
        string descripcion,
        DateTimeOffset? fechaCarga = null)
    {
        var errores = ValidarDatos(titulo, descripcion);
        if (errores.Count > 0)
            return errores;

        return new Pendiente
        {
            Id = Guid.CreateVersion7(),
            InternacionId = internacionId,
            Titulo = titulo.Trim(),
            Descripcion = descripcion.Trim(),
            FechaCarga = (fechaCarga ?? DateTimeOffset.UtcNow).ToUniversalTime()
        };
    }

    public ErrorOr<Success> MarcarComoRealizado(DateTimeOffset? fechaResolucion = null)
    {
        if (this.EstaRealizado)
            return InternacionErrors.PendienteYaRealizado;

        var fecha = (fechaResolucion ?? DateTimeOffset.UtcNow).ToUniversalTime();
        if (fecha < this.FechaCarga)
            return InternacionErrors.PendienteFechaResolucionAnteriorACarga;

        this.FechaResolucion = fecha;
        return Result.Success;
    }

    private static List<Error> ValidarDatos(string titulo, string descripcion)
    {
        var errores = new List<Error>();

        if (ValidarTitulo(titulo) is { } errorTitulo)
            errores.Add(errorTitulo);

        if (ValidarDescripcion(descripcion) is { } errorDescripcion)
            errores.Add(errorDescripcion);

        return errores;
    }

    private static Error? ValidarTitulo(string? titulo)
    {
        var valor = titulo?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return InternacionErrors.PendienteTituloRequerido;

        if (valor.Length > MaxLongitudTitulo)
            return InternacionErrors.PendienteTituloMuyLargo;

        return null;
    }

    private static Error? ValidarDescripcion(string? descripcion) =>
        string.IsNullOrWhiteSpace(descripcion) ? InternacionErrors.PendienteDescripcionRequerida : null;
}
