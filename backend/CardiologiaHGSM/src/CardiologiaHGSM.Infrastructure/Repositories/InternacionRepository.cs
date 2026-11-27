using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class InternacionRepository(CardiologiaDbContext context)
    : RepositoryBase<Internacion, Guid>(context), IInternacionRepository
{
    public Task<bool> ExisteAsync(Guid id, CancellationToken ct = default)
        => _dbSet.AnyAsync(i => i.Id == id, ct);

    public Task<bool> ExisteActivaParaPacienteAsync(Guid pacienteId, CancellationToken ct = default)
        => _dbSet.AnyAsync(i => i.PacienteId == pacienteId && i.FechaFin == null, ct);

    public override Task<Internacion?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => _dbSet
            .Include(i => i.MotivosInternacion)
            .FirstOrDefaultAsync(i => i.Id == id, ct);

    public Task<Internacion?> ObtenerActivaPorCamaAsync(Guid camaId, CancellationToken ct = default)
        => _dbSet.FirstOrDefaultAsync(i => i.CamaId == camaId && i.FechaFin == null, ct);

    public Task<Internacion?> ObtenerDetallePorIdAsync(Guid id, CancellationToken ct = default)
        => ConDetalleCompleto().FirstOrDefaultAsync(i => i.Id == id, ct);

    public Task<Internacion?> ObtenerActivaDetallePorPacienteAsync(Guid pacienteId, CancellationToken ct = default)
        => ConDetalleCompleto().FirstOrDefaultAsync(i => i.PacienteId == pacienteId && i.FechaFin == null, ct);

    public async Task<PaginatedList<Internacion>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(i => i.Cama)
            .Include(i => i.MotivosInternacion)
            .AsSplitQuery()
            .Where(i => i.PacienteId == pacienteId);

        if (fechaDesde is { } desde)
        {
            var desdeUtc = desde.InicioDelDiaUtc();
            query = query.Where(i => i.FechaInternacion >= desdeUtc);
        }

        if (fechaHasta is { } hasta)
        {
            var hastaUtcExclusivo = hasta.AddDays(1).InicioDelDiaUtc();
            query = query.Where(i => i.FechaInternacion < hastaUtcExclusivo);
        }

        query = ascendente
            ? query.OrderBy(i => i.FechaInternacion)
            : query.OrderByDescending(i => i.FechaInternacion);

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }

    private IQueryable<Internacion> ConDetalleCompleto()
        => _dbSet
            .AsNoTracking()
            .Include(i => i.Paciente)
            .Include(i => i.Cama)
            .Include(i => i.ObraSocial)
            .Include(i => i.MotivosInternacion)
            .AsSplitQuery();
}
