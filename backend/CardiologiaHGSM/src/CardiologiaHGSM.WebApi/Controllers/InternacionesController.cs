using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Internaciones.Commands.CrearInternacion;
using CardiologiaHGSM.Application.Internaciones.Commands.ModificarInternacion;
using CardiologiaHGSM.Application.Internaciones.Commands.RegistrarAlta;
using CardiologiaHGSM.Application.Internaciones.Dtos;
using CardiologiaHGSM.Application.Internaciones.Queries.ObtenerInternacionPorId;
using CardiologiaHGSM.WebApi.Contracts.Internaciones;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/internaciones")]
public class InternacionesController : ApiControllerBase
{
    // HU-19 / RF-47: crear internación de un paciente.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        [FromBody] CrearInternacionRequest request,
        [FromServices] ICommandHandler<CrearInternacionCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearInternacionCommand(
            request.PacienteId!.Value,
            request.CamaId!.Value,
            request.EnfermedadActual,
            request.MotivoInternacionIds,
            request.Manejo,
            request.FechaInternacion,
            request.ObraSocialId,
            request.Aislamiento,
            request.CamaAislamientoId,
            request.ParametrosAntropometria,
            request.TratamientoPrevio,
            request.TratamientoActual,
            request.Observaciones);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            id => CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id }),
            Problem);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(InternacionDetalleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(
        Guid id,
        [FromServices] IQueryHandler<ObtenerInternacionPorIdQuery, InternacionDetalleDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ObtenerInternacionPorIdQuery(id), ct);
        return result.Match(Ok, Problem);
    }

    // HU-20 / RF-49: modificar internación activa y pase o intercambio (swap) de cama.
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Modificar(
        Guid id,
        [FromBody] ModificarInternacionRequest request,
        [FromServices] ICommandHandler<ModificarInternacionCommand> handler,
        CancellationToken ct)
    {
        var command = new ModificarInternacionCommand(
            id,
            request.CamaId!.Value,
            request.FechaInternacion!.Value,
            request.Manejo!.Value,
            request.EnfermedadActual,
            request.MotivoInternacionIds,
            request.ObraSocialId,
            request.Aislamiento,
            request.CamaAislamientoId,
            request.ParametrosAntropometria,
            request.TratamientoPrevio,
            request.Observaciones);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // HU-22 / RF-50: registrar fin de internación / alta y liberar cama.
    [HttpPost("{id:guid}/alta")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RegistrarAlta(
        Guid id,
        [FromBody] RegistrarAltaRequest request,
        [FromServices] ICommandHandler<RegistrarAltaCommand> handler,
        CancellationToken ct)
    {
        var command = new RegistrarAltaCommand(
            id,
            request.CondicionAlta!.Value,
            request.FechaFin!.Value);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
