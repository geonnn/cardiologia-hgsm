using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public class MotivoInternacionRepository(CardiologiaDbContext context)
    : CatalogoRepositoryBase<MotivoInternacion, int>(context), IMotivoInternacionRepository
{
    public override Task<bool> EstaEnUsoAsync(int id, CancellationToken ct = default)
        => _context.Internaciones.AnyAsync(i => i.MotivosInternacion.Any(m => m.Id == id), ct);

    public async Task<IReadOnlyList<MotivoInternacion>> GetByIdsAsync(
        IReadOnlyCollection<int> ids,
        CancellationToken ct = default)
    {
        if (ids.Count == 0)
            return [];

        return await _dbSet
            .Where(m => ids.Contains(m.Id))
            .ToListAsync(ct);
    }
}
