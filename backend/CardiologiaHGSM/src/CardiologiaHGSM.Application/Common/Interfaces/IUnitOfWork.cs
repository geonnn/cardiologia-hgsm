using ErrorOr;

namespace CardiologiaHGSM.Application.Common.Interfaces;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    Task<ErrorOr<T>> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<ErrorOr<T>>> action,
        CancellationToken ct = default
    );
}
