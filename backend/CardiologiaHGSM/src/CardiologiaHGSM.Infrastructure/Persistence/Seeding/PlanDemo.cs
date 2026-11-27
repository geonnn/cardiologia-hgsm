using CardiologiaHGSM.Domain.Enums;

namespace CardiologiaHGSM.Infrastructure.Persistence.Seeding;

internal sealed class PlanDemo(DateTimeOffset ahora)
{
    public const int PacienteRecurrente = 1;
    public const int PacienteIngresoReciente = 2;
    public const int PrimerPacienteSinInternacion = 3;
    public const int CantidadPacientesSinInternacion = 20;

    private static readonly TimeZoneInfo ZonaHospital =
        TimeZoneInfo.FindSystemTimeZoneById("America/Argentina/Buenos_Aires");

    public DateTimeOffset Ahora { get; } = DateTimeOffset.FromUnixTimeMilliseconds(ahora.ToUnixTimeMilliseconds());
    public DateOnly Hoy { get; } = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(ahora, ZonaHospital).DateTime);
    public DateOnly PrimerDia => Hoy.AddDays(-120);

    public static IEnumerable<(int Numero, Manejo Sector)> Camas =>
        Enumerable.Range(1, 7).Select(numero => (numero, Manejo.UCO))
            .Concat(Enumerable.Range(1, 20).Select(numero => (numero, Manejo.Sala)));

    public DateTimeOffset Instante(DateOnly dia, int horaLocal)
    {
        var fechaLocal = dia.ToDateTime(new TimeOnly(horaLocal, 0));
        var utc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(fechaLocal, ZonaHospital));
        return dia == Hoy && utc > Ahora ? Ahora : utc;
    }

    public IEnumerable<EpisodioDemo> CrearEpisodios()
    {
        var siguientePaciente = PrimerPacienteSinInternacion + CantidadPacientesSinInternacion;
        var activos = new List<EpisodioDemo>();

        foreach (var (numero, sector) in Camas)
        {
            var diasDesdeIngresoActivo = (sector, numero) switch
            {
                (Manejo.UCO, 1) => 15,
                (Manejo.UCO, 2) => 0,
                (Manejo.UCO, 3 or 4) => numero,
                (Manejo.Sala, <= 13) => 1 + (numero - 1) % 9,
                _ => (int?)null
            };
            var ingresoActivo = diasDesdeIngresoActivo is { } dias ? Hoy.AddDays(-dias) : (DateOnly?)null;
            var ultimoEgreso = (ingresoActivo ?? Hoy).AddDays(-1);

            if ((sector, numero) == (Manejo.UCO, 1))
            {
                for (var i = 0; i < 12; i++)
                {
                    var ingreso = PrimerDia.AddDays(i * 9);
                    yield return new EpisodioDemo(PacienteRecurrente, numero, sector, ingreso, ingreso.AddDays(2));
                }
            }
            else
            {
                var ingreso = PrimerDia.AddDays((numero - 1) % 4);
                for (var i = 0; ingreso <= ultimoEgreso; i++)
                {
                    var duracion = sector == Manejo.UCO ? 3 + (numero + i) % 3 : 4 + (numero + i) % 5;
                    var egreso = ingreso.AddDays(duracion - 1);
                    yield return new EpisodioDemo(siguientePaciente++, numero, sector, ingreso,
                        egreso <= ultimoEgreso ? egreso : ultimoEgreso);
                    ingreso = ingreso.AddDays(duracion + 1 + (numero + i) % 2);
                }
            }

            if (ingresoActivo is { } dia)
            {
                var paciente = (sector, numero) switch
                {
                    (Manejo.UCO, 1) => PacienteRecurrente,
                    (Manejo.UCO, 2) => PacienteIngresoReciente,
                    _ => siguientePaciente++
                };
                activos.Add(new EpisodioDemo(paciente, numero, sector, dia, null));
            }
        }

        foreach (var activo in activos)
            yield return activo;
    }
}

internal sealed record EpisodioDemo(int NumeroPaciente, int NumeroCama, Manejo Sector, DateOnly Ingreso, DateOnly? Egreso)
{
    public bool EsIngresoReciente => NumeroPaciente == PlanDemo.PacienteIngresoReciente;
    public bool EsInternacionActivaRecurrente => NumeroPaciente == PlanDemo.PacienteRecurrente && Egreso is null;
}
