using CardiologiaHGSM.Application.Camas.Dtos;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using ErrorOr;

namespace CardiologiaHGSM.Application.Camas.Queries.ObtenerCamaPorId;

public class ObtenerCamaPorIdHandler(
    ICamaRepository camaRepository
) : IQueryHandler<ObtenerCamaPorIdQuery, CamaDto>
{
    public async Task<ErrorOr<CamaDto>> HandleAsync(ObtenerCamaPorIdQuery query, CancellationToken ct = default)
    {
        var cama = await camaRepository.GetConInternacionActivaAsync(query.Id, ct);
        if (cama is null)
            return CamaErrors.NoEncontrada;

        return CamaDto.FromEntity(cama, DateOnly.FromDateTime(DateTimeOffset.Now.DateTime));
    }
}
