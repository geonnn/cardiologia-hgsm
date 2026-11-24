using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;

namespace CardiologiaHGSM.Application.Catalogos.Interfaces;

public interface ICatalogoRepository<T, TId> : IRepositoryBase<T, TId>
    where T : class, ICatalogo<T, TId>
    where TId : struct
{
    Task<IReadOnlyList<T>> ListarAsync(string? busqueda = null, CancellationToken ct = default);
    Task<bool> ExisteAsync(TId id, CancellationToken ct = default);
    Task<bool> ExisteNombreAsync(string nombre, TId? excluirId = null, CancellationToken ct = default);
    Task<bool> EstaEnUsoAsync(TId id, CancellationToken ct = default);
}
