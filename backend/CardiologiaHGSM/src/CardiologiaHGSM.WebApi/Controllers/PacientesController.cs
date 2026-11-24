using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Pacientes.Commands.AgregarContacto;
using CardiologiaHGSM.Application.Pacientes.Commands.CrearPaciente;
using CardiologiaHGSM.Application.Pacientes.Commands.EliminarContacto;
using CardiologiaHGSM.Application.Pacientes.Commands.ModificarPaciente;
using CardiologiaHGSM.Application.Pacientes.Dtos;
using CardiologiaHGSM.Application.Pacientes.Queries.ListarPacientes;
using CardiologiaHGSM.Application.Pacientes.Queries.ObtenerPacientePorDni;
using CardiologiaHGSM.Application.Pacientes.Queries.ObtenerPacientePorId;
using CardiologiaHGSM.WebApi.Contracts.Pacientes;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/pacientes")]
public class PacientesController : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<PacienteResumenDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(
        [FromQuery] ListarPacientesQuery query,
        [FromServices] IQueryHandler<ListarPacientesQuery, PaginatedList<PacienteResumenDto>> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PacienteDetalleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(
        Guid id,
        [FromServices] IQueryHandler<ObtenerPacientePorIdQuery, PacienteDetalleDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ObtenerPacientePorIdQuery(id), ct);
        return result.Match(Ok, Problem);
    }

    [HttpGet("dni/{dni}")]
    [ProducesResponseType(typeof(PacienteDetalleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorDni(
        string dni,
        [FromServices] IQueryHandler<ObtenerPacientePorDniQuery, PacienteDetalleDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ObtenerPacientePorDniQuery(dni), ct);
        return result.Match(Ok, Problem);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        [FromBody] CrearPacienteRequest request,
        [FromServices] ICommandHandler<CrearPacienteCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearPacienteCommand(
            request.Nombre,
            request.Apellido,
            request.Dni,
            request.FechaNacimiento!.Value,
            request.Sexo!.Value,
            request.Antecedentes,
            request.MedicoDeCabeceraId);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            id => CreatedAtAction(nameof(ObtenerPorId), new { id }, new { id }),
            Problem);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Modificar(
        Guid id,
        [FromBody] ModificarPacienteRequest request,
        [FromServices] ICommandHandler<ModificarPacienteCommand> handler,
        CancellationToken ct)
    {
        var command = new ModificarPacienteCommand(
            id,
            request.Nombre,
            request.Apellido,
            request.Dni,
            request.FechaNacimiento!.Value,
            request.Sexo!.Value,
            request.Antecedentes,
            request.MedicoDeCabeceraId);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    [HttpPost("{id:guid}/contactos")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AgregarContacto(
        Guid id,
        [FromBody] AgregarContactoRequest request,
        [FromServices] ICommandHandler<AgregarContactoCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new AgregarContactoCommand(
            id,
            request.Nombre,
            request.Telefono,
            request.Apellido,
            request.Parentesco);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            contactoId => StatusCode(StatusCodes.Status201Created, new { id = contactoId }),
            Problem);
    }

    [HttpDelete("{id:guid}/contactos/{contactoId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EliminarContacto(
        Guid id,
        Guid contactoId,
        [FromServices] ICommandHandler<EliminarContactoCommand> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new EliminarContactoCommand(id, contactoId), ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
