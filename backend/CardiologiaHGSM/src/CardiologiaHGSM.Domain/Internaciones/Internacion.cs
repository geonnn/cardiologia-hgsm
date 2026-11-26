using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Domain.Internaciones;

public class Internacion
{
    public const int MaxLongitudAislamiento = 50;

    public Guid Id { get; private set; }
    public DateTimeOffset FechaInternacion { get; private set; }
    public Manejo Manejo { get; private set; }
    public string EnfermedadActual { get; private set; } = null!;
    public string? Aislamiento { get; private set; }
    public string? ParametrosAntropometria { get; private set; }
    public string? TratamientoPrevio { get; private set; }
    public string? Observaciones { get; private set; }
    public DateTimeOffset? FechaFin { get; private set; }
    public CondicionAlta? CondicionAlta { get; private set; }

    public bool EstaActiva => this.FechaFin is null;

    public ObraSocial? ObraSocial { get; private set; }
    public int? ObraSocialId { get; private set; }

    public Paciente Paciente { get; private set; } = null!;
    public Guid PacienteId { get; private set; }

    public Cama Cama { get; private set; } = null!;
    public Guid CamaId { get; private set; }

    private readonly List<MotivoInternacion> _motivosInternacion = [];
    public IReadOnlyCollection<MotivoInternacion> MotivosInternacion => _motivosInternacion.AsReadOnly();

    private Internacion() { }

    public static ErrorOr<Internacion> Crear(
        Guid pacienteId,
        Guid camaId,
        Manejo manejo,
        string enfermedadActual,
        IReadOnlyCollection<MotivoInternacion> motivos,
        DateTimeOffset? fechaInternacion = null,
        int? obraSocialId = null,
        string? aislamiento = null,
        string? parametrosAntropometria = null,
        string? tratamientoPrevio = null,
        string? observaciones = null,
        DateTimeOffset? ahora = null)
    {
        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaIngreso = (fechaInternacion ?? referencia).ToUniversalTime();
        var errores = ValidarDatosClinicos(fechaIngreso, enfermedadActual, aislamiento, referencia);

        if (ValidarMotivos(motivos) is { } errorMotivos)
            errores.Add(errorMotivos);

        if (errores.Count > 0)
            return errores;

        var internacion = new Internacion
        {
            Id = Guid.CreateVersion7(),
            FechaInternacion = fechaIngreso,
            PacienteId = pacienteId,
            CamaId = camaId,
            Manejo = manejo,
            EnfermedadActual = enfermedadActual.Trim(),
            ObraSocialId = obraSocialId,
            Aislamiento = NormalizarOpcional(aislamiento),
            ParametrosAntropometria = parametrosAntropometria,
            TratamientoPrevio = tratamientoPrevio,
            Observaciones = observaciones
        };

        internacion._motivosInternacion.AddRange(motivos);
        return internacion;
    }

    public ErrorOr<Success> Modificar(
        DateTimeOffset fechaInternacion,
        Manejo manejo,
        string enfermedadActual,
        int? obraSocialId = null,
        string? aislamiento = null,
        string? parametrosAntropometria = null,
        string? tratamientoPrevio = null,
        string? observaciones = null,
        DateTimeOffset? ahora = null)
    {
        if (!this.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaIngreso = fechaInternacion.ToUniversalTime();
        var errores = ValidarDatosClinicos(fechaIngreso, enfermedadActual, aislamiento, referencia);
        if (errores.Count > 0)
            return errores;

        this.FechaInternacion = fechaIngreso;
        this.Manejo = manejo;
        this.EnfermedadActual = enfermedadActual.Trim();
        this.ObraSocialId = obraSocialId;
        this.Aislamiento = NormalizarOpcional(aislamiento);
        this.ParametrosAntropometria = parametrosAntropometria;
        this.TratamientoPrevio = tratamientoPrevio;
        this.Observaciones = observaciones;

        return Result.Success;
    }

    public ErrorOr<Success> CambiarCama(Guid nuevaCamaId)
    {
        if (!this.EstaActiva)
            return InternacionErrors.YaFinalizada;

        this.CamaId = nuevaCamaId;
        return Result.Success;
    }

    public ErrorOr<Success> DarAlta(
        CondicionAlta condicionAlta,
        DateTimeOffset fechaFin,
        DateTimeOffset? ahora = null)
    {
        if (!this.EstaActiva)
            return InternacionErrors.YaFinalizada;

        var referencia = (ahora ?? DateTimeOffset.UtcNow).ToUniversalTime();
        var fechaEgreso = fechaFin.ToUniversalTime();
        var errores = ValidarFechaFin(fechaEgreso, referencia);
        if (errores.Count > 0)
            return errores;

        this.CondicionAlta = condicionAlta;
        this.FechaFin = fechaEgreso;
        return Result.Success;
    }

    public ErrorOr<Success> AgregarMotivoInternacion(MotivoInternacion motivoInternacion)
    {
        if (!this.EstaActiva)
            return InternacionErrors.YaFinalizada;

        if (_motivosInternacion.Any(m => m.Id == motivoInternacion.Id && motivoInternacion.Id != 0))
            return InternacionErrors.MotivoDuplicado;

        _motivosInternacion.Add(motivoInternacion);
        return Result.Success;
    }

    public ErrorOr<Success> ReemplazarMotivosInternacion(IReadOnlyCollection<MotivoInternacion> motivos)
    {
        if (!this.EstaActiva)
            return InternacionErrors.YaFinalizada;

        if (ValidarMotivos(motivos) is { } errorMotivos)
            return errorMotivos;

        _motivosInternacion.Clear();
        _motivosInternacion.AddRange(motivos);
        return Result.Success;
    }

    private static List<Error> ValidarDatosClinicos(
        DateTimeOffset fechaInternacion,
        string enfermedadActual,
        string? aislamiento,
        DateTimeOffset ahora)
    {
        var errores = new List<Error>();

        if (ValidarFechaIngreso(fechaInternacion, ahora) is { } errorFecha)
            errores.Add(errorFecha);

        if (ValidarEnfermedadActual(enfermedadActual) is { } errorEnfermedad)
            errores.Add(errorEnfermedad);

        if (ValidarAislamiento(aislamiento) is { } errorAislamiento)
            errores.Add(errorAislamiento);

        return errores;
    }

    private static Error? ValidarFechaIngreso(DateTimeOffset fechaInternacion, DateTimeOffset ahora) =>
        fechaInternacion > ahora ? InternacionErrors.FechaIngresoFutura : null;

    private static Error? ValidarEnfermedadActual(string? enfermedadActual) =>
        string.IsNullOrWhiteSpace(enfermedadActual) ? InternacionErrors.EnfermedadActualRequerida : null;

    private static Error? ValidarAislamiento(string? aislamiento)
    {
        var valor = NormalizarOpcional(aislamiento);
        return valor is not null && valor.Length > MaxLongitudAislamiento
            ? InternacionErrors.AislamientoMuyLargo
            : null;
    }

    private static Error? ValidarMotivos(IReadOnlyCollection<MotivoInternacion>? motivos) =>
        motivos is null || motivos.Count == 0 ? InternacionErrors.MotivosRequeridos : null;

    private List<Error> ValidarFechaFin(DateTimeOffset fechaFin, DateTimeOffset ahora)
    {
        var errores = new List<Error>();

        if (fechaFin > ahora)
            errores.Add(InternacionErrors.FechaFinFutura);

        if (fechaFin < this.FechaInternacion)
            errores.Add(InternacionErrors.FechaFinAnteriorAIngreso);

        return errores;
    }

    private static string? NormalizarOpcional(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
}
