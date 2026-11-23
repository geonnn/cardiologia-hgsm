using ErrorOr;

namespace CardiologiaHGSM.Application.Common.Interfaces;

public interface IQueryHandler<in TQuery, TResponse>
{
    Task<ErrorOr<TResponse>> HandleAsync(TQuery query, CancellationToken ct = default);
}
