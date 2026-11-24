using CardiologiaHGSM.Application.Camas.Dtos;
using CardiologiaHGSM.Application.Common.Interfaces;
using ErrorOr;

namespace CardiologiaHGSM.Application.Camas.Queries.ListarCamas;

public class ListarCamasHandler(
    ICamaRepository camaRepository
) : IQueryHandler<ListarCamasQuery, IReadOnlyList<CamaDto>>
{
    public async Task<ErrorOr<IReadOnlyList<CamaDto>>> HandleAsync(ListarCamasQuery query, CancellationToken ct = default)
    {
        var camas = await camaRepository.ListarConInternacionActivaAsync(query.Sector, query.Estado, ct);
        var ahora = DateTime.UtcNow;

        return camas
            .Select(c => CamaDto.FromEntity(c, ahora))
            .ToList();
    }
}
