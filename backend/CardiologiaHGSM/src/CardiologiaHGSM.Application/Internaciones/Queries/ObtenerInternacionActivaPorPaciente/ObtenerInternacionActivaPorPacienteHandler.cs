using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Pacientes;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using ErrorOr;

namespace CardiologiaHGSM.Application.Internaciones.Queries.ObtenerInternacionActivaPorPaciente;

public class ObtenerInternacionActivaPorPacienteHandler(
    IPacienteRepository pacienteRepository,
    IInternacionRepository internacionRepository
) : IQueryHandler<ObtenerInternacionActivaPorPacienteQuery, InternacionDetalleDto>
{
    public async Task<ErrorOr<InternacionDetalleDto>> HandleAsync(
        ObtenerInternacionActivaPorPacienteQuery query,
        CancellationToken ct = default)
    {
        if (!await pacienteRepository.ExisteAsync(query.PacienteId, ct))
            return PacienteErrors.NoEncontrado;

        var internacion = await internacionRepository.ObtenerActivaDetallePorPacienteAsync(query.PacienteId, ct);
        if (internacion is null)
            return InternacionErrors.NoEncontrada;

        var hoy = DateOnly.FromDateTime(DateTime.Today);
        return InternacionDetalleDto.FromEntity(internacion, hoy);
    }
}
