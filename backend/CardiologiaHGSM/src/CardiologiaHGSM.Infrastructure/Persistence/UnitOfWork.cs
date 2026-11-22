using CardiologiaHGSM.Application.Common.Interfaces;
using ErrorOr;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Persistence;

public class UnitOfWork(CardiologiaDbContext context) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => context.SaveChangesAsync(ct); 

    public async Task<ErrorOr<T>> ExecuteInTransactionAsync<T>(Func<CancellationToken, Task<ErrorOr<T>>> action, CancellationToken ct = default)
    {
        var strategy = context.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await context.Database.BeginTransactionAsync(ct);
            try
            {
                var result = await action(ct);
                if (result.IsError)
                {
                    await transaction.RollbackAsync(CancellationToken.None);
                    return result;
                }
                await context.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);
                return result;
            }
            catch
            {
                await transaction.RollbackAsync(CancellationToken.None);
                throw;
            }
        });
    }
}
