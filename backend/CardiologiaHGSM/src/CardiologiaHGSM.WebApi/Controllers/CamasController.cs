using CardiologiaHGSM.Application.Camas.Commands.CambiarEstadoCama;
using CardiologiaHGSM.Application.Camas.Commands.CrearCama;
using CardiologiaHGSM.Application.Camas.Dtos;
using CardiologiaHGSM.Application.Camas.Queries.ListarCamas;
using CardiologiaHGSM.Application.Camas.Queries.ObtenerCamaPorId;
using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Domain.Camas.EstadoCama;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.WebApi.Contracts.Camas;
using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/camas")]
public class CamasController : ApiControllerBase
{
    // RF-10
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        CrearCamaRequest request,
        [FromServices] ICommandHandler<CrearCamaCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearCamaCommand(request.NumeroCama, request.Sector!.Value);
        var result = await handler.HandleAsync(command, ct);

        return result.Match(
            id => CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id }),
            Problem);
    }

    // RF-11 y RF-11.1
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<CamaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(
        [FromQuery] Manejo? sector,
        [FromQuery] EstadoCamaTipo? estado,
        [FromServices] IQueryHandler<ListarCamasQuery, IReadOnlyList<CamaDto>> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ListarCamasQuery(sector, estado), ct);
        return result.Match(Ok, Problem);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CamaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(
        Guid id,
        [FromServices] IQueryHandler<ObtenerCamaPorIdQuery, CamaDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ObtenerCamaPorIdQuery(id), ct);
        return result.Match(Ok, Problem);
    }

    // RF-27
    [HttpPost("{id:guid}/bloquear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public Task<IActionResult> BloquearPorAislamiento(
        Guid id,
        [FromServices] ICommandHandler<CambiarEstadoCamaCommand> handler,
        CancellationToken ct)
        => CambiarEstado(id, AccionEstadoCama.BloquearPorAislamiento, handler, ct);

    // RF-28
    [HttpPost("{id:guid}/desbloquear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public Task<IActionResult> Desbloquear(
        Guid id,
        [FromServices] ICommandHandler<CambiarEstadoCamaCommand> handler,
        CancellationToken ct)
        => CambiarEstado(id, AccionEstadoCama.Desbloquear, handler, ct);

    // RF-29
    [HttpPost("{id:guid}/deshabilitar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public Task<IActionResult> Deshabilitar(
        Guid id,
        [FromServices] ICommandHandler<CambiarEstadoCamaCommand> handler,
        CancellationToken ct)
        => CambiarEstado(id, AccionEstadoCama.Deshabilitar, handler, ct);

    // RF-30
    [HttpPost("{id:guid}/habilitar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public Task<IActionResult> Habilitar(
        Guid id,
        [FromServices] ICommandHandler<CambiarEstadoCamaCommand> handler,
        CancellationToken ct)
        => CambiarEstado(id, AccionEstadoCama.Habilitar, handler, ct);

    private async Task<IActionResult> CambiarEstado(
        Guid id,
        AccionEstadoCama accion,
        ICommandHandler<CambiarEstadoCamaCommand> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new CambiarEstadoCamaCommand(id, accion), ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
