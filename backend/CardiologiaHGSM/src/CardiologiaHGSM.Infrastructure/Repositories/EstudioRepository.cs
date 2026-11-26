using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Pacientes;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class EstudioRepository(CardiologiaDbContext context)
    : RepositoryBase<Estudio, Guid>(context), IEstudioRepository
{
    public async Task<PaginatedList<Estudio>> ListarPorPacienteAsync(
        Guid pacienteId,
        int page = 1,
        int pageSize = 10,
        int? tipoEstudioId = null,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        CancellationToken ct = default)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(e => e.TipoEstudio)
            .Where(e => e.PacienteId == pacienteId);

        if (tipoEstudioId is not null)
            query = query.Where(e => e.TipoEstudioId == tipoEstudioId);

        if (fechaDesde is { } desde)
            query = query.Where(e => e.Fecha >= desde);

        if (fechaHasta is { } hasta)
            query = query.Where(e => e.Fecha <= hasta);

        return await query
            .OrderByDescending(e => e.Fecha)
            .ToPaginatedListAsync(page, pageSize, ct);
    }
}
