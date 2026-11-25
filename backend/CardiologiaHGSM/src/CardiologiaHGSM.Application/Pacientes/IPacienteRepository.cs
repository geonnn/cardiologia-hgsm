using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes;

public interface IPacienteRepository : IRepositoryBase<Paciente, Guid>
{
    Task<bool> ExisteAsync(Guid id, CancellationToken ct = default);
    Task<Paciente?> GetByDniAsync(Dni dni, CancellationToken ct = default);
    Task<bool> ExisteDniAsync(Dni dni, CancellationToken ct = default);
    Task<PaginatedList<Paciente>> ListarAsync(PacienteFiltro filtro, CancellationToken ct = default);
}
