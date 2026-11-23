using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Pacientes;

namespace CardiologiaHGSM.Application.Pacientes;

public interface IPacienteRepository : IRepositoryBase<Paciente, Guid>
{
    Task<Paciente?> GetByDniAsync(Dni dni, CancellationToken ct = default);
    Task<bool> ExisteDniAsync(Dni dni, CancellationToken ct = default);
}
