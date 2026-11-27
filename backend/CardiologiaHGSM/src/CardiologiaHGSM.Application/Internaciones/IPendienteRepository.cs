using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones;

public interface IPendienteRepository : IRepositoryBase<Pendiente, Guid>
{
    // Tracked: verifica que el pendiente pertenezca a la internación indicada (RF-46).
    Task<Pendiente?> ObtenerPorIdEnInternacionAsync(
        Guid internacionId,
        Guid pendienteId,
        CancellationToken ct = default);

    Task<PaginatedList<Pendiente>> ListarPorInternacionAsync(
        Guid internacionId,
        int page = 1,
        int pageSize = 10,
        bool? realizado = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default);
}
