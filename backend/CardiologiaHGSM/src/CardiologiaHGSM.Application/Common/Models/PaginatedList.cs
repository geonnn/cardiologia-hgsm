namespace CardiologiaHGSM.Application.Common.Models;

public sealed record PaginatedList<T>
{
    public IReadOnlyList<T> Items { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalPages { get; }
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public PaginatedList(IReadOnlyList<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = pageSize > 0
            ? (int)Math.Ceiling(totalCount / (double)pageSize)
            : 0;
    }

    public PaginatedList<TResult> Map<TResult>(Func<T, TResult> selector)
    => new(Items.Select(selector).ToList(), Page, PageSize, TotalCount);

    public static PaginatedList<T> Empty(int page = 1, int pageSize = 10)
        => new([], page, pageSize, 0);
}
