using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class PendienteRepository(CardiologiaDbContext context)
    : RepositoryBase<Pendiente, Guid>(context), IPendienteRepository
{
    public Task<Pendiente?> ObtenerPorIdEnInternacionAsync(
        Guid internacionId,
        Guid pendienteId,
        CancellationToken ct = default)
        => _dbSet.FirstOrDefaultAsync(
            p => p.Id == pendienteId && p.InternacionId == internacionId,
            ct);

    public async Task<PaginatedList<Pendiente>> ListarPorInternacionAsync(
        Guid internacionId,
        int page = 1,
        int pageSize = 10,
        bool? realizado = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default)
    {
        var query = _dbSet
            .AsNoTracking()
            .Where(p => p.InternacionId == internacionId);

        if (realizado is true)
            query = query.Where(p => p.FechaResolucion != null);
        else if (realizado is false)
            query = query.Where(p => p.FechaResolucion == null);

        if (fechaDesde is { } desde)
        {
            var desdeUtc = desde.InicioDelDiaUtc();
            query = query.Where(p => p.FechaCarga >= desdeUtc);
        }

        if (fechaHasta is { } hasta)
        {
            var hastaUtcExclusivo = hasta.AddDays(1).InicioDelDiaUtc();
            query = query.Where(p => p.FechaCarga < hastaUtcExclusivo);
        }

        query = ascendente
            ? query.OrderBy(p => p.FechaCarga).ThenBy(p => p.Id)
            : query.OrderByDescending(p => p.FechaCarga).ThenByDescending(p => p.Id);

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }
}
