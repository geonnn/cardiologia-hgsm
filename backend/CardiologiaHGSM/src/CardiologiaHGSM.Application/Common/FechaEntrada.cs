namespace CardiologiaHGSM.Application.Common;

public static class FechaEntrada
{
    public const int ToleranciaMinutosReloj = 5;

    /// <summary>
    /// Si la fecha enviada por el cliente está apenas adelantada (hasta 5 minutos) por
    /// desfasaje entre el reloj del cliente y el del servidor, se ajusta a <paramref name="ahora"/>.
    /// Si excede esa tolerancia, se devuelve en UTC sin cambios para que el dominio la rechace.
    /// </summary>
    public static DateTimeOffset AjustarDesfasajeReloj(DateTimeOffset fecha, DateTimeOffset ahora)
    {
        var fechaUtc = fecha.ToUniversalTime();
        var ahoraUtc = ahora.ToUniversalTime();

        return fechaUtc > ahoraUtc && fechaUtc <= ahoraUtc.AddMinutes(ToleranciaMinutosReloj)
            ? ahoraUtc
            : fechaUtc;
    }

    public static DateTimeOffset? AjustarDesfasajeReloj(DateTimeOffset? fecha, DateTimeOffset ahora) =>
        fecha is { } valor ? AjustarDesfasajeReloj(valor, ahora) : null;
}
