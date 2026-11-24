using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public class TipoEstudioRepository(CardiologiaDbContext context)
    : CatalogoRepositoryBase<TipoEstudio, int>(context), ITipoEstudioRepository
{
    public override Task<bool> EstaEnUsoAsync(int id, CancellationToken ct = default)
        => _context.Estudios.AnyAsync(e => e.TipoEstudioId == id, ct);
}
