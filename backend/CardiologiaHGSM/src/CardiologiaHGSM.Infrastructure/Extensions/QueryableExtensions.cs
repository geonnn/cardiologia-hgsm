using CardiologiaHGSM.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Extensions;

public static class QueryableExtensions
{
    public static async Task<PaginatedList<T>> ToPaginatedListAsync<T>(
        this IQueryable<T> query,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var totalCount = await query.CountAsync(ct);
        if (totalCount == 0)
            return PaginatedList<T>.Empty(page, pageSize);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        return new PaginatedList<T>(items, page, pageSize, totalCount);
    }
}
