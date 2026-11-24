using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Interfaces;

public interface IMotivoInternacionRepository : ICatalogoRepository<MotivoInternacion, int>
{
    Task<IReadOnlyList<MotivoInternacion>> GetByIdsAsync(IReadOnlyCollection<int> ids, CancellationToken ct = default);
}
