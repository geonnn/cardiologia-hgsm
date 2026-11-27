using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Queries.ListarPacientes;

public class ListarPacientesHandler(
    IPacienteRepository pacienteRepository,
    IInternacionRepository internacionRepository
) : IQueryHandler<ListarPacientesQuery, PaginatedList<PacienteResumenDto>>
{
    public async Task<ErrorOr<PaginatedList<PacienteResumenDto>>> HandleAsync(
        ListarPacientesQuery query,
        CancellationToken ct = default)
    {
        if (query.FechaCargaDesde.HasValue && query.FechaCargaHasta.HasValue && query.FechaCargaDesde > query.FechaCargaHasta)
            return PacienteErrors.RangoFechasInvalido;

        var filtro = new PacienteFiltro(
            Page: Math.Max(1, query.Page),
            PageSize: Math.Clamp(query.PageSize, 1, 100),
            Busqueda: query.Busqueda,
            Sexo: query.Sexo,
            MedicoDeCabeceraId: query.MedicoDeCabeceraId,
            FactorDeRiesgoId: query.FactorDeRiesgoId,
            MotivoInternacionId: query.MotivoInternacionId,
            ConInternacionActiva: query.ConInternacionActiva,
            FechaCargaDesde: query.FechaCargaDesde,
            FechaCargaHasta: query.FechaCargaHasta,
            OrdenarPor: query.OrdenarPor,
            Descendente: query.Descendente);

        var pacientes = await pacienteRepository.ListarAsync(filtro, ct);
        IReadOnlyDictionary<Guid, Guid> internacionesActivas = query.ConInternacionActiva == false
            ? new Dictionary<Guid, Guid>()
            : await internacionRepository.ObtenerActivasPorPacientesAsync(
                pacientes.Items.Select(p => p.Id).ToList(),
                ct);
        var hoy = DateOnly.FromDateTime(DateTimeOffset.Now.DateTime);

        return pacientes.Map(p => PacienteResumenDto.FromEntity(
            p,
            hoy,
            internacionesActivas.TryGetValue(p.Id, out var internacionId) ? internacionId : null));
    }
}
