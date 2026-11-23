using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Pacientes;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class PacienteRepository : RepositoryBase<Paciente, Guid>, IPacienteRepository
{
    public PacienteRepository(CardiologiaDbContext context) : base(context)
    { }

    public async Task<Paciente?> GetByDniAsync(Dni dni, CancellationToken ct = default)
        => await _dbSet.FirstOrDefaultAsync(p => p.Dni == dni, ct);

    public async Task<bool> ExisteDniAsync(Dni dni, CancellationToken ct = default)
        => await _dbSet.AnyAsync(p => p.Dni == dni, ct);
}
