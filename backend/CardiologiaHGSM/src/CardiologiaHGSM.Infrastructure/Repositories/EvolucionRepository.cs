using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class EvolucionRepository(CardiologiaDbContext context)
    : RepositoryBase<Evolucion, Guid>(context), IEvolucionRepository
{
    public async Task<PaginatedList<Evolucion>> ListarPorInternacionAsync(
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
            .Where(e => e.InternacionId == internacionId);

        if (fechaDesde is { } desde)
        {
            var desdeUtc = desde.InicioDelDiaUtc();
            query = query.Where(e => e.Fecha >= desdeUtc);
        }

        if (fechaHasta is { } hasta)
        {
            var hastaUtcExclusivo = hasta.AddDays(1).InicioDelDiaUtc();
            query = query.Where(e => e.Fecha < hastaUtcExclusivo);
        }

        query = ascendente
            ? query.OrderBy(e => e.Fecha).ThenBy(e => e.Id)
            : query.OrderByDescending(e => e.Fecha).ThenByDescending(e => e.Id);

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }
}
