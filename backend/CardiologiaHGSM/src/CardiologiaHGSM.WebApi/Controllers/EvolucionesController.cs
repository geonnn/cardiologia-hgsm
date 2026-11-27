using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Commands.CrearEvolucion;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Internaciones.Queries.ListarEvolucionesPorInternacion;
using CardiologiaHGSM.WebApi.Contracts.Evoluciones;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/internaciones/{internacionId:guid}/evoluciones")]
public class EvolucionesController : ApiControllerBase
{
    // HU-24 / RF-39, 39.1, 39.2: listar, ordenar y filtrar evoluciones de una internación.
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<EvolucionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Listar(
        Guid internacionId,
        [FromServices] IQueryHandler<ListarEvolucionesPorInternacionQuery, PaginatedList<EvolucionDto>> handler,
        CancellationToken ct,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateOnly? fechaDesde = null,
        [FromQuery] DateOnly? fechaHasta = null,
        [FromQuery] bool ascendente = false)
    {
        var query = new ListarEvolucionesPorInternacionQuery(
            internacionId, page, pageSize, fechaDesde, fechaHasta, ascendente);

        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    // HU-23 / RF-38: registrar nota de evolución médica en una internación activa.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        Guid internacionId,
        [FromBody] CrearEvolucionRequest request,
        [FromServices] ICommandHandler<CrearEvolucionCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearEvolucionCommand(
            internacionId,
            request.Detalle,
            request.Fecha!.Value);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            evolucionId => StatusCode(StatusCodes.Status201Created, new { id = evolucionId }),
            Problem);
    }
}
