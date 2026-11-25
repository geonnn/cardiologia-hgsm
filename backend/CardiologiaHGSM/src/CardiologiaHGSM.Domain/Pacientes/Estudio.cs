using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Domain.Pacientes;

public class Estudio
{
    public const int MaxLongitudTitulo = 100;

    public Guid Id { get; private init; }
    public Guid PacienteId { get; private set; }
    public Paciente Paciente { get; private set; } = null!;
    public int TipoEstudioId { get; private set; }
    public TipoEstudio TipoEstudio { get; private set; } = null!;
    public string Titulo { get; private set; } = null!;
    public DateTime Fecha { get; private set; }
    public string Descripcion { get; private set; } = null!;

    private Estudio() { }

    public static ErrorOr<Estudio> Crear(
        Guid pacienteId,
        int tipoEstudioId,
        string titulo,
        DateTime fecha,
        string descripcion)
    {
        var errores = ValidarDatos(titulo, fecha, descripcion);
        if (errores.Count > 0)
            return errores;

        return new Estudio
        {
            Id = Guid.CreateVersion7(),
            PacienteId = pacienteId,
            TipoEstudioId = tipoEstudioId,
            Titulo = titulo.Trim(),
            Fecha = fecha,
            Descripcion = descripcion.Trim()
        };
    }

    private static List<Error> ValidarDatos(string titulo, DateTime fecha, string descripcion)
    {
        var errores = new List<Error>();

        if (ValidarTitulo(titulo) is { } errorTitulo)
            errores.Add(errorTitulo);

        if (ValidarFecha(fecha) is { } errorFecha)
            errores.Add(errorFecha);

        if (ValidarDescripcion(descripcion) is { } errorDescripcion)
            errores.Add(errorDescripcion);

        return errores;
    }

    private static Error? ValidarTitulo(string? titulo)
    {
        var valor = titulo?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(valor))
            return EstudioErrors.TituloRequerido;

        if (valor.Length > MaxLongitudTitulo)
            return EstudioErrors.TituloMuyLargo;

        return null;
    }

    private static Error? ValidarFecha(DateTime fecha) =>
        fecha > DateTime.UtcNow ? EstudioErrors.FechaFutura : null;

    private static Error? ValidarDescripcion(string? descripcion) =>
        string.IsNullOrWhiteSpace(descripcion) ? EstudioErrors.DescripcionRequerida : null;
}
