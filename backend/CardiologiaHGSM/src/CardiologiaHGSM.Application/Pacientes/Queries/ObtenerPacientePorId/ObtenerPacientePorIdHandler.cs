using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Queries.ObtenerPacientePorId;

public class ObtenerPacientePorIdHandler(
    IPacienteRepository pacienteRepository
) : IQueryHandler<ObtenerPacientePorIdQuery, PacienteDetalleDto>
{
    public async Task<ErrorOr<PacienteDetalleDto>> HandleAsync(ObtenerPacientePorIdQuery query, CancellationToken ct = default)
    {

        var paciente = await pacienteRepository.GetByIdAsync(query.Id, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        return PacienteDetalleDto.FromEntity(paciente, DateOnly.FromDateTime(DateTimeOffset.Now.DateTime));
    }
}
