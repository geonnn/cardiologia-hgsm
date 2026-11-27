namespace CardiologiaHGSM.Infrastructure.Extensions;

public static class DateOnlyExtensions
{
    /// <summary>
    /// Convierte una fecha calendario (00:00 en la zona horaria del servidor, TZ) a instante UTC (+00:00)
    /// para comparar contra columnas timestamptz en PostgreSQL/Npgsql.
    /// </summary>
    public static DateTimeOffset InicioDelDiaUtc(this DateOnly fecha) =>
        new DateTimeOffset(fecha.ToDateTime(TimeOnly.MinValue, DateTimeKind.Local)).ToUniversalTime();
}
