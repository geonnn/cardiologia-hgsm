namespace CardiologiaHGSM.Application.Common.Interfaces;

public interface IRepositoryBase<T, TId>
    where T : class
    where TId : notnull
{
    void Add(T entity);
    void Remove(T entity);
    Task<T?> GetByIdAsync(TId id, CancellationToken ct = default);
}
