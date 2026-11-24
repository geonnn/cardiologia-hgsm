using CardiologiaHGSM.Application.Camas;
using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class CamaRepository : RepositoryBase<Cama, Guid>, ICamaRepository
{
    public CamaRepository(CardiologiaDbContext context) : base(context)
    { }

    public async Task<bool> ExisteNumeroEnSectorAsync(int numeroCama, Manejo sector, CancellationToken ct = default)
        => await _dbSet.AnyAsync(c => c.NumeroCama == numeroCama && c.Sector == sector, ct);

    public async Task<IReadOnlyList<CamaConInternacion>> ListarConInternacionActivaAsync(
        Manejo? sector = null,
        EstadoCamaTipo? estado = null,
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking();

        if (sector is { } s)
            query = query.Where(c => c.Sector == s);

        if (estado is { } e)
        {
            var estadoCama = EstadoCamaFactory.Crear(e);
            query = query.Where(c => c.EstadoCama == estadoCama);
        }

        var camas = await query.ToListAsync(ct);
        var internaciones = await GetInternacionesActivasAsync(camas.Select(c => c.Id).ToList(), ct);

        return camas
            .OrderBy(c => c.Sector)
            .ThenBy(c => c.NumeroCama)
            .Select(c => new CamaConInternacion(c, internaciones.GetValueOrDefault(c.Id)))
            .ToList();
    }

    public async Task<CamaConInternacion?> GetConInternacionActivaAsync(Guid id, CancellationToken ct = default)
    {
        var cama = await _dbSet.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (cama is null)
            return null;

        var internaciones = await GetInternacionesActivasAsync([id], ct);
        return new CamaConInternacion(cama, internaciones.GetValueOrDefault(id));
    }

    private async Task<Dictionary<Guid, Internacion>> GetInternacionesActivasAsync(
        List<Guid> camaIds,
        CancellationToken ct)
    {
        if (camaIds.Count == 0)
            return [];

        // El índice único IX_Internaciones_CamaId_Activa garantiza a lo sumo una activa por cama.
        return await _context.Internaciones
            .AsNoTracking()
            .Include(i => i.Paciente)
            .Include(i => i.MotivosInternacion)
            .Where(i => i.FechaFin == null && camaIds.Contains(i.CamaId))
            .ToDictionaryAsync(i => i.CamaId, ct);
    }
}
