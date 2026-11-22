using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public abstract class RepositoryBase<T, TId> : IRepositoryBase<T, TId>
    where T: class
    where TId: notnull
{
    protected readonly CardiologiaDbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected RepositoryBase(CardiologiaDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public void Add(T entity) => _dbSet.Add(entity);

    public void Remove(T entity) => _dbSet.Remove(entity);

    public virtual async Task<T?> GetByIdAsync(TId id, CancellationToken ct = default)
        => await _dbSet.FindAsync([id], ct);
}
