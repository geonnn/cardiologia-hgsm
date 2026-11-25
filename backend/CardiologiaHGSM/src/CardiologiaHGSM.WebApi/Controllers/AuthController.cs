using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Usuarios.Commands.CambiarMiPassword;
using CardiologiaHGSM.Application.Usuarios.Commands.CerrarSesion;
using CardiologiaHGSM.Application.Usuarios.Commands.IniciarSesion;
using CardiologiaHGSM.Application.Usuarios.Commands.ModificarMisDatos;
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
    // Devuelve el JWT que el front tiene que mandar en Authorization: Bearer <token>.
    [ProducesResponseType(typeof(SesionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] ICommandHandler<IniciarSesionCommand, SesionDto> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new IniciarSesionCommand(request.Email, request.Password), ct);
        return result.Match(Ok, Problem);
    }

    // RF-04: invalida todos los tokens del usuario, también los de otros dispositivos.
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

    // RF-05
    [HttpPut("me")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ModificarMisDatos(
        [FromBody] ModificarMisDatosRequest request,
        [FromServices] ICommandHandler<ModificarMisDatosCommand> handler,
        CancellationToken ct)
    {
        var result = await handler.HandleAsync(new ModificarMisDatosCommand(request.Nombre, request.Apellido), ct);
        return result.Match(_ => NoContent(), Problem);
    }

    // RF-06: los tokens anteriores dejan de valer; la respuesta trae uno nuevo para seguir en este dispositivo.
    [HttpPut("me/password")]
    [ProducesResponseType(typeof(SesionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CambiarMiPassword(
        [FromBody] CambiarMiPasswordRequest request,
        [FromServices] ICommandHandler<CambiarMiPasswordCommand, SesionDto> handler,
        CancellationToken ct)
    {
        var command = new CambiarMiPasswordCommand(
            request.PasswordActual,
            request.PasswordNueva,
            request.ConfirmacionPassword);

        var result = await handler.HandleAsync(command, ct);
        return result.Match(Ok, Problem);
    }
}
