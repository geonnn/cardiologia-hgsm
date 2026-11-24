using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Usuarios.Commands.CambiarPasswordUsuario;
using CardiologiaHGSM.Application.Usuarios.Commands.CrearUsuario;
using CardiologiaHGSM.Application.Usuarios.Commands.EliminarUsuario;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Application.Usuarios.Queries.ListarUsuarios;
using CardiologiaHGSM.Domain.Usuarios;
using CardiologiaHGSM.WebApi.Contracts.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

// Panel de administración: solo usuarios con rol Administrador.
[Route("api/usuarios")]
[Authorize(Roles = Rol.Administrador)]
public class UsuariosController : ApiControllerBase
{
    // RF-08, RF-08.1, RF-08.2 y RF-08.3
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedList<UsuarioDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(
        [FromQuery] ListarUsuariosQuery query,
        [FromServices] IQueryHandler<ListarUsuariosQuery, PaginatedList<UsuarioDto>> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(query, ct);
        return result.Match(Ok, Problem);
    }

    // RF-02
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(
        [FromBody] CrearUsuarioRequest request,
        [FromServices] ICommandHandler<CrearUsuarioCommand, Guid> handler,
        CancellationToken ct)
    {
        var command = new CrearUsuarioCommand(request.Nombre, request.Apellido, request.Email, request.Password);
        var result = await handler.HandleAsync(command, ct);
        return result.Match(
            id => StatusCode(StatusCodes.Status201Created, new { id }),
            Problem);
    }

    // RF-07
    [HttpPut("{id:guid}/password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CambiarPassword(
        Guid id,
        [FromBody] CambiarPasswordUsuarioRequest request,
        [FromServices] ICommandHandler<CambiarPasswordUsuarioCommand> handler,
        CancellationToken ct)
    {
        var command = new CambiarPasswordUsuarioCommand(id, request.PasswordNueva, request.ConfirmacionPassword);
        var result = await handler.HandleAsync(command, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // RF-09
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Eliminar(
        Guid id,
        [FromServices] ICommandHandler<EliminarUsuarioCommand> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new EliminarUsuarioCommand(id), ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
