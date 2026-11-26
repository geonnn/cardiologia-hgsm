using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Internaciones;

public interface IPendienteRepository : IRepositoryBase<Pendiente, Guid>
{
    // Devuelve el Id de la internación en curso del paciente, o null si no tiene.
    // TODO: mover a IInternacionRepository cuando exista (HU-19).
    Task<Guid?> ObtenerInternacionActivaIdAsync(Guid pacienteId, CancellationToken ct = default);

    Task<PaginatedList<Pendiente>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        bool? realizado = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default);
}