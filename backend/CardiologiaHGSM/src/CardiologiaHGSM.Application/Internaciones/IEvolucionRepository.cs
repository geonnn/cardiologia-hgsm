using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones;

public interface IEvolucionRepository : IRepositoryBase<Evolucion, Guid>
{
    Task<PaginatedList<Evolucion>> ListarPorInternacionAsync(
        Guid internacionId,
        int page = 1,
        int pageSize = 10,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default);
}
