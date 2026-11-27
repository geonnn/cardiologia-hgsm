using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Internaciones.Commands.CrearTratamiento;
using CardiologiaHGSM.Application.Internaciones.Commands.EliminarTratamiento;
using CardiologiaHGSM.Application.Internaciones.Commands.ModificarTratamiento;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Internaciones.Queries.ListarTratamientosPorInternacion;
using CardiologiaHGSM.WebApi.Contracts.Tratamientos;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/internaciones/{internacionId:guid}/tratamientos")]
public class TratamientosController : ApiControllerBase
{
    // HU-26 / RF-41, 41.1, 41.2: listar, ordenar y filtrar tratamientos de una internación.
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<TratamientoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Listar(
        Guid internacionId,
        [FromServices] IQueryHandler<ListarTratamientosPorInternacionQuery, PaginatedList<TratamientoDto>> handler,
        CancellationToken ct,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateOnly? fechaDesde = null,
        [FromQuery] DateOnly? fechaHasta = null,
        [FromQuery] bool ascendente = false)
    {
        var query = new ListarTratamientosPorInternacionQuery(
            internacionId, page, pageSize, fechaDesde, fechaHasta, ascendente);

        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    // HU-25 / RF-40: registrar nuevo tratamiento o indicación en una internación activa.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        Guid internacionId,
        [FromBody] CrearTratamientoRequest request,
        [FromServices] ICommandHandler<CrearTratamientoCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearTratamientoCommand(
            internacionId,
            request.Descripcion,
            request.Fecha);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            tratamientoId => StatusCode(StatusCodes.Status201Created, new { id = tratamientoId }),
            Problem);
    }

    // HU-27 / RF-42: modificar únicamente el último tratamiento vigente de una internación activa.
    [HttpPut("{tratamientoId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Modificar(
        Guid internacionId,
        Guid tratamientoId,
        [FromBody] ModificarTratamientoRequest request,
        [FromServices] ICommandHandler<ModificarTratamientoCommand> handler,
        CancellationToken ct)
    {
        var command = new ModificarTratamientoCommand(
            internacionId,
            tratamientoId,
            request.Descripcion,
            request.Fecha);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // HU-28 / RF-43: eliminar un tratamiento de una internación activa.
    [HttpDelete("{tratamientoId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Eliminar(
        Guid internacionId,
        Guid tratamientoId,
        [FromServices] ICommandHandler<EliminarTratamientoCommand> handler,
        CancellationToken ct)
    {
        var command = new EliminarTratamientoCommand(internacionId, tratamientoId);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
