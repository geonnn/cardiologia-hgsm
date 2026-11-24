using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public abstract class CatalogoRepositoryBase<T, TId>(CardiologiaDbContext context)
    : RepositoryBase<T, TId>(context), ICatalogoRepository<T, TId>
    where T : class, ICatalogo<T, TId>
    where TId : struct
{
    public async Task<IReadOnlyList<T>> ListarAsync(string? busqueda = null, CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            var patron = $"%{busqueda.Trim()}%";
            query = query.Where(e => EF.Functions.ILike(e.Nombre, patron));
        }

        return await query
            .OrderBy(e => e.Nombre)
            .ToListAsync(ct);
    }

    public async Task<bool> ExisteAsync(TId id, CancellationToken ct = default)
        => await _dbSet.FindAsync([id], ct) is not null;

    public async Task<bool> ExisteNombreAsync(string nombre, TId? excluirId = null, CancellationToken ct = default)
    {
        var normalizado = nombre.Trim().ToLower();

        var ids = await _dbSet
            .AsNoTracking()
            .Where(e => e.Nombre.ToLower() == normalizado)
            .Select(e => e.Id)
            .ToListAsync(ct);

        return excluirId.HasValue
            ? ids.Any(id => !EqualityComparer<TId>.Default.Equals(id, excluirId.Value))
            : ids.Count > 0;
    }

    public abstract Task<bool> EstaEnUsoAsync(TId id, CancellationToken ct = default);
}
