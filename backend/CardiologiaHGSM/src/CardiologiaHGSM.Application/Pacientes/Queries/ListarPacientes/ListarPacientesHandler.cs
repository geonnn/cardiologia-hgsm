using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Queries.ListarPacientes;

public class ListarPacientesHandler(
    IPacienteRepository pacienteRepository
) : IQueryHandler<ListarPacientesQuery, PaginatedList<PacienteResumenDto>>
{
    public async Task<ErrorOr<PaginatedList<PacienteResumenDto>>> HandleAsync(ListarPacientesQuery query, CancellationToken ct = default)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 5, 100);
        
        var pacientes = await pacienteRepository.ListarAsync(
            page,
            pageSize,
            query.Busqueda,
            query.Sexo,
            query.MedicoDeCabeceraId,
            query.FactorDeRiesgoId
        );

        return pacientes.Map(PacienteResumenDto.FromEntity);
    }
}
