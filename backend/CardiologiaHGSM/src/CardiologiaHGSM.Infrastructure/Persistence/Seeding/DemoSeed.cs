using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CardiologiaHGSM.Infrastructure.Persistence.Seeding;

internal sealed class DemoSeed(CardiologiaDbContext dbContext, ILogger<DemoSeed> logger)
{
    public async Task EjecutarAsync(DateTimeOffset ahora, CancellationToken ct)
    {
        var plan = new PlanDemo(ahora);
        await using var tx = await dbContext.Database.BeginTransactionAsync(ct);

        logger.LogInformation("Cargando el seed demo desde {Desde} hasta {Hasta}.", plan.PrimerDia, plan.Hoy);
        var catalogos = await CatalogosDemo.CargarAsync(dbContext, ct);
        await dbContext.SaveChangesAsync(ct); // Los catálogos numéricos necesitan sus IDs para crear las relaciones.

        var datos = new DatosDemo(dbContext, plan, catalogos);
        var episodios = plan.CrearEpisodios().ToArray();
        var (camas, camasNuevas) = await PrepararCamasAsync(ct);
        var (pacientes, pacientesNuevos) = await PrepararPacientesAsync(episodios, plan, datos, ct);

        var idsPaciente = pacientes.Values.Select(paciente => paciente.Id).ToArray();
        var idsCama = PlanDemo.Camas.Select(clave => camas[clave].Id).ToArray();
        var primerIngreso = plan.Instante(plan.PrimerDia, 8);
        var ocupaciones = await dbContext.Internaciones.AsNoTracking()
            .Where(internacion => (idsPaciente.Contains(internacion.PacienteId) || idsCama.Contains(internacion.CamaId)) &&
                (internacion.FechaFin == null || internacion.FechaFin >= primerIngreso))
            .Select(internacion => new Ocupacion(internacion.PacienteId, internacion.CamaId,
                internacion.FechaInternacion, internacion.FechaFin))
            .ToListAsync(ct);
        var estudiosExistentes = await dbContext.Estudios.AsNoTracking()
            .Where(estudio => idsPaciente.Contains(estudio.PacienteId) && estudio.Fecha >= plan.PrimerDia)
            .Select(estudio => new ClaveEstudioDemo(estudio.PacienteId, estudio.TipoEstudioId, estudio.Titulo, estudio.Fecha))
            .ToHashSetAsync(ct);

        var episodiosCreados = 0;
        foreach (var episodio in episodios)
        {
            ct.ThrowIfCancellationRequested();
            var cama = camas[(episodio.NumeroCama, episodio.Sector)];
            var paciente = pacientes[episodio.NumeroPaciente];
            var ingreso = plan.Instante(episodio.Ingreso, 8);
            var egreso = episodio.Egreso is { } fin ? plan.Instante(fin, 15) : (DateTimeOffset?)null;

            if (cama.EstadoCama.Tipo != EstadoCamaTipo.Disponible ||
                ocupaciones.Any(ocupacion => ocupacion.Interfiere(paciente.Id, cama.Id, ingreso, egreso)))
                continue;

            var internacion = datos.CrearInternacion(episodio, paciente, cama, ingreso);
            Validar(cama.Ocupar());
            dbContext.Internaciones.Add(internacion);
            datos.AgregarHistoria(episodio, internacion, estudiosExistentes);

            if (egreso is { } fechaFin)
            {
                Validar(internacion.DarAlta(DatosDemo.CondicionDeAlta(episodio), fechaFin, plan.Ahora));
                Validar(cama.Liberar());
            }

            ocupaciones.Add(new Ocupacion(paciente.Id, cama.Id, ingreso, egreso));
            episodiosCreados++;
        }

        foreach (var cama in camasNuevas)
        {
            switch (cama.Sector, cama.NumeroCama)
            {
                case (Manejo.UCO, 5) or (Manejo.Sala, 14):
                    Validar(cama.BloquearPorAislamiento());
                    break;
                case (Manejo.UCO, 7) or (Manejo.Sala, 20):
                    Validar(cama.Deshabilitar());
                    break;
            }
        }

        await dbContext.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        logger.LogInformation(
            "Seed demo aplicado. {Camas} camas nuevas, {Pacientes} pacientes nuevos, {Internaciones} internaciones y {Omitidas} episodios omitidos.",
            camasNuevas.Count, pacientesNuevos, episodiosCreados, episodios.Length - episodiosCreados);
    }

    private async Task<(Dictionary<(int Numero, Manejo Sector), Cama> Todas, List<Cama> Nuevas)> PrepararCamasAsync(CancellationToken ct)
    {
        var camas = await dbContext.Camas.ToDictionaryAsync(cama => (cama.NumeroCama, cama.Sector), ct);
        var nuevas = new List<Cama>();
        foreach (var clave in PlanDemo.Camas)
        {
            if (camas.ContainsKey(clave))
                continue;

            var cama = Validar(Cama.Crear(clave.Numero, clave.Sector));
            dbContext.Camas.Add(cama);
            camas.Add(clave, cama);
            nuevas.Add(cama);
        }

        return (camas, nuevas);
    }

    private async Task<(Dictionary<int, Paciente> Todos, int Nuevos)> PrepararPacientesAsync(
        EpisodioDemo[] episodios, PlanDemo plan, DatosDemo datos, CancellationToken ct)
    {
        var fechasCarga = episodios.GroupBy(episodio => episodio.NumeroPaciente)
            .ToDictionary(grupo => grupo.Key, grupo => grupo.Min(episodio => episodio.Ingreso));
        for (var i = 0; i < PlanDemo.CantidadPacientesSinInternacion; i++)
            fechasCarga.Add(PlanDemo.PrimerPacienteSinInternacion + i, plan.Hoy.AddDays(-i));

        var existentes = await dbContext.Pacientes
            .Where(paciente => EF.Functions.ILike((string)(object)paciente.Dni, "DEMO%"))
            .ToDictionaryAsync(paciente => paciente.Dni, ct);
        var pacientes = new Dictionary<int, Paciente>();
        var nuevos = 0;

        foreach (var (numero, diaCarga) in fechasCarga.OrderBy(entrada => entrada.Key))
        {
            var dni = Validar(Dni.Crear(FormattableString.Invariant($"DEMO{numero:D5}")));
            if (!existentes.TryGetValue(dni, out var paciente))
            {
                paciente = datos.CrearPaciente(numero, dni, diaCarga);
                dbContext.Pacientes.Add(paciente);
                nuevos++;
            }

            pacientes.Add(numero, paciente);
        }

        return (pacientes, nuevos);
    }

    internal static T Validar<T>(ErrorOr<T> resultado)
    {
        if (!resultado.IsError)
            return resultado.Value;

        var errores = string.Join(" | ", resultado.Errors.Select(error => error.Description));
        throw new InvalidOperationException($"El dominio rechazó un registro del seed demo. {errores}");
    }

    private sealed record Ocupacion(Guid PacienteId, Guid CamaId, DateTimeOffset Ingreso, DateTimeOffset? Egreso)
    {
        public bool Interfiere(Guid pacienteId, Guid camaId, DateTimeOffset ingreso, DateTimeOffset? egreso)
        {
            if (PacienteId != pacienteId && CamaId != camaId)
                return false;

            return Egreso is null || (PacienteId == pacienteId && Ingreso == ingreso) ||
                (ingreso < Egreso.Value && (egreso is null || Ingreso < egreso.Value));
        }
    }
}
