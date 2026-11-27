using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones;

public interface IInternacionRepository : IRepositoryBase<Internacion, Guid>
{
    Task<bool> ExisteAsync(Guid id, CancellationToken ct = default);
    Task<bool> ExisteActivaParaPacienteAsync(Guid pacienteId, CancellationToken ct = default);
    Task<IReadOnlyDictionary<Guid, Guid>> ObtenerActivasPorPacientesAsync(
        IReadOnlyCollection<Guid> pacienteIds,
        CancellationToken ct = default);

    // Tracked: para el intercambio de camas (swap, RF-49).
    Task<Internacion?> ObtenerActivaPorCamaAsync(Guid camaId, CancellationToken ct = default);

    // Solo lectura (AsNoTracking) con navegaciones completas para DTOs.
    Task<Internacion?> ObtenerDetallePorIdAsync(Guid id, CancellationToken ct = default);
    Task<Internacion?> ObtenerActivaDetallePorPacienteAsync(Guid pacienteId, CancellationToken ct = default);

    Task<PaginatedList<Internacion>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default);
}
