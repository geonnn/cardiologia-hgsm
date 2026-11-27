using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class TratamientoRepository(CardiologiaDbContext context)
    : RepositoryBase<Tratamiento, Guid>(context), ITratamientoRepository
{
    public Task<Tratamiento?> ObtenerPorIdEnInternacionAsync(
        Guid internacionId,
        Guid tratamientoId,
        CancellationToken ct = default)
        => _dbSet.FirstOrDefaultAsync(
            t => t.Id == tratamientoId && t.InternacionId == internacionId,
            ct);

    public Task<Guid?> ObtenerUltimoIdAsync(Guid internacionId, CancellationToken ct = default)
        => _dbSet
            .AsNoTracking()
            .Where(t => t.InternacionId == internacionId)
            .OrderByDescending(t => t.Fecha)
            .ThenByDescending(t => t.Id)
            .Select(t => (Guid?)t.Id)
            .FirstOrDefaultAsync(ct);

    public async Task<PaginatedList<Tratamiento>> ListarPorInternacionAsync(
        Guid internacionId,
        int page = 1,
        int pageSize = 10,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default)
    {
        var query = _dbSet
            .AsNoTracking()
            .Where(t => t.InternacionId == internacionId);

        if (fechaDesde is { } desde)
        {
            var desdeUtc = desde.InicioDelDiaUtc();
            query = query.Where(t => t.Fecha >= desdeUtc);
        }

        if (fechaHasta is { } hasta)
        {
            var hastaUtcExclusivo = hasta.AddDays(1).InicioDelDiaUtc();
            query = query.Where(t => t.Fecha < hastaUtcExclusivo);
        }

        query = ascendente
            ? query.OrderBy(t => t.Fecha).ThenBy(t => t.Id)
            : query.OrderByDescending(t => t.Fecha).ThenByDescending(t => t.Id);

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }
}
