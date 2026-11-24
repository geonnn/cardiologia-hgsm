using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Usuarios.Commands.CerrarSesion;
using CardiologiaHGSM.Application.Usuarios.Commands.IniciarSesion;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using CardiologiaHGSM.Application.Usuarios.Queries.ObtenerUsuarioActual;
using CardiologiaHGSM.WebApi.Contracts.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

[Route("api/auth")]
[Authorize]
public class AuthController : ApiControllerBase
{
    // RF-01 y RF-03: mismo login; el acceso al panel de administración se controla por rol.
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UsuarioActualDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] ICommandHandler<IniciarSesionCommand, UsuarioActualDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new IniciarSesionCommand(request.Email, request.Password), ct);
        return result.Match(Ok, Problem);
    }

    // RF-04
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(
        [FromServices] ICommandHandler<CerrarSesionCommand> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new CerrarSesionCommand(), ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // Usado por el front para saber si hay sesión y quién es el usuario.
    [HttpGet("me")]
    [ProducesResponseType(typeof(UsuarioActualDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Me(
        [FromServices] IQueryHandler<ObtenerUsuarioActualQuery, UsuarioActualDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ObtenerUsuarioActualQuery(), ct);
        return result.Match(Ok, Problem);
    }
}
