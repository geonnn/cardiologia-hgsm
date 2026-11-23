using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Pacientes.Queries.ObtenerPacientePorDni;

public class ObtenerPacientePorDniHandler(
    IPacienteRepository pacienteRepository
) : IQueryHandler<ObtenerPacientePorDniQuery, PacienteDetalleDto>
{
    public async Task<ErrorOr<PacienteDetalleDto>> HandleAsync(ObtenerPacientePorDniQuery query, CancellationToken ct = default)
    {

        var dniResult = Dni.Crear(query.Dni);
        if (dniResult.IsError)
            return dniResult.Errors;

        var paciente = await pacienteRepository.GetByDniAsync(dniResult.Value, ct);
        if (paciente is null)
            return PacienteErrors.NoEncontrado;

        return PacienteDetalleDto.FromEntity(paciente);
    }
}
