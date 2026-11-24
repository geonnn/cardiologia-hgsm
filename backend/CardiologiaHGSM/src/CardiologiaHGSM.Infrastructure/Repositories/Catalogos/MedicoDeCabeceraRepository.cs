using CardiologiaHGSM.Application.Catalogos.Interfaces;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories.Catalogos;

public class MedicoDeCabeceraRepository(CardiologiaDbContext context)
    : CatalogoRepositoryBase<MedicoDeCabecera, Guid>(context), IMedicoDeCabeceraRepository
{
    public override Task<bool> EstaEnUsoAsync(Guid id, CancellationToken ct = default)
        => _context.Pacientes.AnyAsync(p => p.MedicoDeCabeceraId == id, ct);
}
