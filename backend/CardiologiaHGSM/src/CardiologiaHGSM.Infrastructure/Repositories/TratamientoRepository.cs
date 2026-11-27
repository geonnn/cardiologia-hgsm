using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Infrastructure.Persistence;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class TratamientoRepository(CardiologiaDbContext context)
    : RepositoryBase<Tratamiento, Guid>(context), ITratamientoRepository;
