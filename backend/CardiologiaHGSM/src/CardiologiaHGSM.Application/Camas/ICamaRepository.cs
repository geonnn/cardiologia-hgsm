using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;

namespace CardiologiaHGSM.Application.Camas;

public interface ICamaRepository : IRepositoryBase<Cama, Guid>
{
    Task<bool> ExisteNumeroEnSectorAsync(int numeroCama, Manejo sector, CancellationToken ct = default);

    // Devuelve las camas junto con su internación activa (si la tienen),
    // con Paciente y MotivosInternacion cargados.
    Task<IReadOnlyList<CamaConInternacion>> ListarConInternacionActivaAsync(
        Manejo? sector = null,
        EstadoCamaTipo? estado = null,
        CancellationToken ct = default);

    Task<CamaConInternacion?> GetConInternacionActivaAsync(Guid id, CancellationToken ct = default);
}

public sealed record CamaConInternacion(Cama Cama, Internacion? InternacionActiva);
