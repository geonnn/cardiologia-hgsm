using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public class FactorDeRiesgoRepository(CardiologiaDbContext context)
    : CatalogoRepositoryBase<FactorDeRiesgo, int>(context), IFactorDeRiesgoRepository
{
    public override Task<bool> EstaEnUsoAsync(int id, CancellationToken ct = default)
        => _context.Pacientes.AnyAsync(p => p.FactoresDeRiesgo.Any(f => f.Id == id), ct);

    public async Task<IReadOnlyList<FactorDeRiesgo>> GetByIdsAsync(
        IReadOnlyCollection<int> ids,
        CancellationToken ct = default)
    {
        if (ids.Count == 0)
            return [];

        return await _dbSet
            .Where(f => ids.Contains(f.Id))
            .ToListAsync(ct);
    }
}
