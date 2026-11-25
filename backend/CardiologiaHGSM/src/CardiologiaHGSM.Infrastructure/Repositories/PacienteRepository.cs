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

    public async Task<bool> ExisteAsync(Guid id, CancellationToken ct = default)
        => await _dbSet.AnyAsync(p => p.Id == id, ct);

    public override async Task<Paciente?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await ConAgregadoCompleto().FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<Paciente?> GetByDniAsync(Dni dni, CancellationToken ct = default)
        => await ConAgregadoCompleto().FirstOrDefaultAsync(p => p.Dni == dni, ct);

    public async Task<bool> ExisteDniAsync(Dni dni, CancellationToken ct = default)
        => await _dbSet.AnyAsync(p => p.Dni == dni, ct);

    public async Task<PaginatedList<Paciente>> ListarAsync(
        int page = 1,
        int pageSize = 10,
        string? busqueda = null,
        Sexo? sexo = null,
        Guid? medicoDeCabeceraId = null,
        int? factorDeRiesgoId = null,
        int? motivoInternacionId = null,
        DateTime? fechaDesde = null,
        DateTime? fechaHasta = null,
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busqueda))
        {
            var patron = $"%{busqueda.Trim()}%";
            query = _context.Pacientes
                .FromSqlInterpolated(
                    $"SELECT * FROM \"Pacientes\" WHERE \"Dni\" ILIKE {patron} OR \"Nombre\" ILIKE {patron} OR \"Apellido\" ILIKE {patron}")
                .AsNoTracking();
        }

        if (sexo is not null)
            query = query.Where(p => p.Sexo == sexo);

        if (medicoDeCabeceraId is not null)
            query = query.Where(p => p.MedicoDeCabeceraId == medicoDeCabeceraId);

        if (factorDeRiesgoId is not null)
            query = query.Where(p => p.FactoresDeRiesgo.Any(f => f.Id == factorDeRiesgoId));

        if (motivoInternacionId is not null)
            query = query.Where(p => _context.Internaciones.Any(i =>
                i.PacienteId == p.Id &&
                i.MotivosInternacion.Any(m => m.Id == motivoInternacionId)));

        if (fechaDesde is not null)
        {
            var desdeUtc = DateTime.SpecifyKind(fechaDesde.Value.Date, DateTimeKind.Utc);
            query = query.Where(p => p.FechaCarga >= desdeUtc);
        }

        if (fechaHasta is not null)
        {
            var hastaUtcExclusivo = DateTime.SpecifyKind(fechaHasta.Value.Date.AddDays(1), DateTimeKind.Utc);
            query = query.Where(p => p.FechaCarga < hastaUtcExclusivo);
        }

        return await query
            .OrderBy(p => p.Apellido)
            .ThenBy(p => p.Nombre)
            .ToPaginatedListAsync(page, pageSize, ct);
    }

    private IQueryable<Paciente> ConAgregadoCompleto()
        => _dbSet
            .Include(p => p.MedicoDeCabecera)
            .Include(p => p.Contactos)
            .Include(p => p.FactoresDeRiesgo)
            .AsSplitQuery();
}
