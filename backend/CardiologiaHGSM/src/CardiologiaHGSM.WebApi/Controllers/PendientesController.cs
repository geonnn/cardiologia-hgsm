using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Commands.AgregarPendiente;
using CardiologiaHGSM.Application.Internaciones.Commands.DesmarcarRealizacionPendiente;
using CardiologiaHGSM.Application.Internaciones.Commands.RegistrarRealizacionPendiente;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Internaciones.Queries.ListarPendientesPorInternacion;
using CardiologiaHGSM.WebApi.Contracts.Pendientes;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/internaciones/{internacionId:guid}/pendientes")]
public class PendientesController : ApiControllerBase
{
    // HU-33 / RF-45, 45.1, 45.2: listar, ordenar y filtrar pendientes de una internación.
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<PendienteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Listar(
        Guid internacionId,
        [FromServices] IQueryHandler<ListarPendientesPorInternacionQuery, PaginatedList<PendienteDto>> handler,
        CancellationToken ct,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] bool? realizado = null,
        [FromQuery] DateOnly? fechaDesde = null,
        [FromQuery] DateOnly? fechaHasta = null,
        [FromQuery] bool ascendente = false)
    {
        var query = new ListarPendientesPorInternacionQuery(
            internacionId, page, pageSize, realizado, fechaDesde, fechaHasta, ascendente);

        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    // HU-32 / RF-44: agregar pendiente a una internación activa.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Agregar(
        Guid internacionId,
        [FromBody] AgregarPendienteRequest request,
        [FromServices] ICommandHandler<AgregarPendienteCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new AgregarPendienteCommand(internacionId, request.Titulo, request.Descripcion);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            pendienteId => StatusCode(StatusCodes.Status201Created, new { id = pendienteId }),
            Problem);
    }

    // HU-34 / RF-46: registrar realización de un pendiente de una internación activa.
    [HttpPost("{pendienteId:guid}/realizar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RegistrarRealizacion(
        Guid internacionId,
        Guid pendienteId,
        [FromServices] ICommandHandler<RegistrarRealizacionPendienteCommand> handler,
        CancellationToken ct)
    {
        var command = new RegistrarRealizacionPendienteCommand(internacionId, pendienteId);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // Reversión de RF-46: desmarcar un pendiente realizado en una internación activa.
    [HttpPost("{pendienteId:guid}/desmarcar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> DesmarcarRealizacion(
        Guid internacionId,
        Guid pendienteId,
        [FromServices] ICommandHandler<DesmarcarRealizacionPendienteCommand> handler,
        CancellationToken ct)
    {
        var command = new DesmarcarRealizacionPendienteCommand(internacionId, pendienteId);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
