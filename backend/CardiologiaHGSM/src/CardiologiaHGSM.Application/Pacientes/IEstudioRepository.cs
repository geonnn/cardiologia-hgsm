using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes;

public interface IEstudioRepository : IRepositoryBase<Estudio, Guid>
{
    Task<PaginatedList<Estudio>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        int? tipoEstudioId = null,
        DateTime? fechaDesde = null,
        DateTime? fechaHasta = null,
        CancellationToken ct = default);
}
