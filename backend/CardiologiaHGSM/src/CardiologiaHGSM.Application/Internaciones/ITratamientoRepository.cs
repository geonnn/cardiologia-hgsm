using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones;

public interface ITratamientoRepository : IRepositoryBase<Tratamiento, Guid>
{
    // Tracked: verifica que el tratamiento pertenezca a la internación indicada (RF-42, RF-43).
    Task<Tratamiento?> ObtenerPorIdEnInternacionAsync(
        Guid internacionId,
        Guid tratamientoId,
        CancellationToken ct = default);

    // Devuelve el Id del tratamiento vigente más reciente (Fecha DESC, Id DESC).
    Task<Guid?> ObtenerUltimoIdAsync(Guid internacionId, CancellationToken ct = default);

    Task<PaginatedList<Tratamiento>> ListarPorInternacionAsync(
        Guid internacionId,
        int page = 1,
        int pageSize = 10,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default);
}
