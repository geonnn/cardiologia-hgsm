using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public class ObraSocialRepository(CardiologiaDbContext context)
    : CatalogoRepositoryBase<ObraSocial, int>(context), IObraSocialRepository
{
    public override Task<bool> EstaEnUsoAsync(int id, CancellationToken ct = default)
        => _context.Internaciones.AnyAsync(i => i.ObraSocialId == id, ct);
}
