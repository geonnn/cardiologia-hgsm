using CardiologiaHGSM.Domain.Catalogos;
using Microsoft.EntityFrameworkCore;
using static CardiologiaHGSM.Infrastructure.Persistence.Seeding.DemoSeed;

namespace CardiologiaHGSM.Infrastructure.Persistence.Seeding;

internal sealed record CatalogosDemo(
    ObraSocial[] ObrasSociales,
    IReadOnlyDictionary<string, TipoEstudio> TiposEstudio,
    FactorDeRiesgo[] FactoresDeRiesgo,
    IReadOnlyDictionary<string, MotivoInternacion> MotivosInternacion,
    MedicoDeCabecera[] MedicosDeCabecera)
{
    public static async Task<CatalogosDemo> CargarAsync(CardiologiaDbContext dbContext, CancellationToken ct)
    {
        var obrasSociales = await CargarAsync<ObraSocial, int>(dbContext.ObrasSociales,
            ["PAMI", "IOMA", "OSECAC", "OSDE", "Swiss Medical", "Unión Personal", "Sancor Salud", "Medifé"],
            "Mutual Demo", ct);
        var tiposEstudio = await CargarAsync<TipoEstudio, int>(dbContext.TiposEstudio,
            DatosDemo.NombresTiposEstudio, "Ecocardiograma de estrés", ct);
        var factores = await CargarAsync<FactorDeRiesgo, int>(dbContext.FactoresDeRiesgo,
            ["Hipertensión arterial", "Diabetes mellitus", "Dislipidemia", "Tabaquismo", "Obesidad",
                "Sedentarismo", "Antecedente familiar", "Enfermedad renal crónica"], "Estrés crónico", ct);
        var motivos = await CargarAsync<MotivoInternacion, int>(dbContext.MotivosInternacion,
            DatosDemo.NombresMotivos, "Miocarditis", ct);
        var medicos = await CargarAsync<MedicoDeCabecera, Guid>(dbContext.MedicosDeCabecera,
            ["Dra. Lucía Vallejos", "Dr. Martín Rocamora", "Dra. Sofía Arrieta", "Dr. Joaquín Serrano",
                "Dra. Emilia Ferreyra", "Dr. Julián Lagos", "Dra. Inés Pereyra"], "Dra. Clara Robledo (Demo)", ct);

        return new CatalogosDemo(obrasSociales,
            tiposEstudio.ToDictionary(tipo => tipo.Nombre.Trim(), StringComparer.OrdinalIgnoreCase), factores,
            motivos.ToDictionary(motivo => motivo.Nombre.Trim(), StringComparer.OrdinalIgnoreCase), medicos);
    }

    private static async Task<T[]> CargarAsync<T, TId>(
        DbSet<T> conjunto, IEnumerable<string> nombres, string nombreLibre, CancellationToken ct)
        where T : class, ICatalogo<T, TId>
        where TId : struct
    {
        var existentes = await conjunto.ToListAsync(ct);
        var porNombre = new Dictionary<string, T>(StringComparer.OrdinalIgnoreCase);
        foreach (var entidad in existentes.OrderBy(entidad => entidad.Id))
            porNombre.TryAdd(entidad.Nombre.Trim(), entidad);

        T ReutilizarOCrear(string nombre)
        {
            if (porNombre.TryGetValue(nombre, out var entidad))
                return entidad;

            entidad = Validar(T.Crear(nombre));
            conjunto.Add(entidad);
            porNombre.Add(entidad.Nombre, entidad);
            return entidad;
        }

        ReutilizarOCrear(nombreLibre);
        return nombres.Select(ReutilizarOCrear).ToArray();
    }
}
