using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes;
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
        PacienteFiltro filtro,
        CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filtro.Busqueda))
        {
            var terminos = filtro.Busqueda.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var termino in terminos)
            {
                var patron = $"%{termino}%";
                query = query.Where(p =>
                    EF.Functions.ILike(p.Nombre, patron) ||
                    EF.Functions.ILike(p.Apellido, patron) ||
                    EF.Functions.ILike((string)(object)p.Dni, patron));
            }
        }

        if (filtro.Sexo is { } sexo)
            query = query.Where(p => p.Sexo == sexo);

        if (filtro.MedicoDeCabeceraId is { } medicoId)
            query = query.Where(p => p.MedicoDeCabeceraId == medicoId);

        if (filtro.FactorDeRiesgoId is { } factorId)
            query = query.Where(p => p.FactoresDeRiesgo.Any(f => f.Id == factorId));

        if (filtro.MotivoInternacionId is { } motivoId)
            query = query.Where(p => _context.Internaciones.Any(i =>
                i.PacienteId == p.Id &&
                i.MotivosInternacion.Any(m => m.Id == motivoId)));

        if (filtro.FechaCargaDesde is { } fechaDesde)
            query = query.Where(p => p.FechaCarga >= fechaDesde);

        if (filtro.FechaCargaHasta is { } fechaHasta)
            query = query.Where(p => p.FechaCarga <= fechaHasta);

        query = (filtro.OrdenarPor, filtro.Descendente) switch
        {
            (PacienteOrden.FechaCarga, false) => query.OrderBy(p => p.FechaCarga),
            (PacienteOrden.FechaCarga, true) => query.OrderByDescending(p => p.FechaCarga),
            (PacienteOrden.Edad, false) => query.OrderByDescending(p => p.FechaNacimiento),
            (PacienteOrden.Edad, true) => query.OrderBy(p => p.FechaNacimiento),
            (PacienteOrden.Alfabetico, true) => query.OrderByDescending(p => p.Apellido).ThenByDescending(p => p.Nombre),
            _ => query.OrderBy(p => p.Apellido).ThenBy(p => p.Nombre)
        };

        return await query.ToPaginatedListAsync(filtro.Page, filtro.PageSize, ct);
    }

    private IQueryable<Paciente> ConAgregadoCompleto()
        => _dbSet
            .Include(p => p.MedicoDeCabecera)
            .Include(p => p.Contactos)
            .Include(p => p.FactoresDeRiesgo)
            .AsSplitQuery();
}
