using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorPaciente;
using CardiologiaHGSM.WebApi.Contracts.Pendientes;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/pacientes/{pacienteId:guid}/pendientes")]
public class PendientesController : ApiControllerBase
{
    // HU-33: listar, ordenar y filtrar pendientes de un paciente.
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<PendienteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Listar(
        Guid pacienteId,
        [FromServices] IQueryHandler<ListarPendientesPorPacienteQuery, PaginatedList<PendienteDto>> handler,
        CancellationToken ct,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] bool? realizado = null,
        [FromQuery] DateTime? fechaDesde = null,
        [FromQuery] DateTime? fechaHasta = null,
        [FromQuery] bool ascendente = false)
    {
        var query = new ListarPendientesPorPacienteQuery(
            pacienteId, page, pageSize, realizado, fechaDesde, fechaHasta, ascendente);

        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    // HU-32: agregar pendiente a un paciente internado.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Agregar(
        Guid pacienteId,
        [FromBody] AgregarPendienteRequest request,
        [FromServices] ICommandHandler<AgregarPendienteCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new AgregarPendienteCommand(pacienteId, request.Titulo, request.Descripcion);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            pendienteId => StatusCode(StatusCodes.Status201Created, new { id = pendienteId }),
            Problem);
    }
}