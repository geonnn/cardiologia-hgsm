using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Interfaces;

public interface IFactorDeRiesgoRepository : ICatalogoRepository<FactorDeRiesgo, int>
{
    Task<IReadOnlyList<FactorDeRiesgo>> GetByIdsAsync(IReadOnlyCollection<int> ids, CancellationToken ct = default);
}
