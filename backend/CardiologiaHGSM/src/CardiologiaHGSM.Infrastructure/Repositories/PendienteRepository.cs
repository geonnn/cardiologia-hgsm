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
    public Task<Guid?> ObtenerInternacionActivaIdAsync(Guid pacienteId, CancellationToken ct = default)
        // Se usa FechaFin == null y no EstaActiva: EstaActiva es una propiedad calculada
        // en C# y EF no puede traducirla a SQL.
        => _context.Internaciones
            .Where(i => i.PacienteId == pacienteId && i.FechaFin == null)
            .Select(i => (Guid?)i.Id)
            .FirstOrDefaultAsync(ct);

    public async Task<PaginatedList<Pendiente>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        bool? realizado = null,
        DateTime? fechaDesde = null,
        DateTime? fechaHasta = null,
        bool ascendente = false,
        CancellationToken ct = default)
    {
        // Pendiente no tiene PacienteId: se llega al paciente a través de su internación.
        // Incluye pendientes de todas las internaciones del paciente.
        var query = _dbSet
            .AsNoTracking()
            .Where(p => p.Internacion.PacienteId == pacienteId);

        if (realizado is true)
            query = query.Where(p => p.FechaResolucion != null);
        else if (realizado is false)
            query = query.Where(p => p.FechaResolucion == null);

        if (fechaDesde is not null)
            query = query.Where(p => p.FechaCarga >= fechaDesde);

        if (fechaHasta is not null)
            query = query.Where(p => p.FechaCarga <= fechaHasta);

        query = ascendente
            ? query.OrderBy(p => p.FechaCarga)
            : query.OrderByDescending(p => p.FechaCarga);

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }
}