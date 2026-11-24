using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Pacientes;
using CardiologiaHGSM.Infrastructure.Extensions;
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

    public async Task<PaginatedList<Paciente>> ListarAsync(
        int page = 1,
        int pageSize = 10,
        string? busqueda = null,
        Sexo? sexo = null,
        Guid? medicoDeCabeceraId = null,
        int? factorDeRiesgoId = null,
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            var patron = $"%{busqueda.Trim()}%";
            query = query.Where(p =>
                EF.Functions.ILike(p.Nombre, patron) ||
                EF.Functions.ILike(p.Apellido, patron));
        }

        if (sexo is not null)
            query = query.Where(p => p.Sexo == sexo);

        if (medicoDeCabeceraId is not null)
            query = query.Where(p => p.MedicoDeCabeceraId == medicoDeCabeceraId);

        if (factorDeRiesgoId is not null)
            query = query.Where(p => p.FactoresDeRiesgo.Any(f => f.Id == factorDeRiesgoId));

        return await query
            .OrderBy(p => p.Apellido)
            .ThenBy(p => p.Nombre)
            .ToPaginatedListAsync(page, pageSize, ct);
    }
}
