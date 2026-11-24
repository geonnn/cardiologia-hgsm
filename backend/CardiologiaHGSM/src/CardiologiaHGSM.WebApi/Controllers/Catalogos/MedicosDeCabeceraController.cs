using CardiologiaHGSM.Application.Catalogos.Dtos;
using CardiologiaHGSM.Application.Catalogos.Services;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.WebApi.Contracts.Catalogos;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers.Catalogos;

[Route("api/medicos-de-cabecera")]
public class MedicosDeCabeceraController(
    CatalogoService<MedicoDeCabecera, Guid> service) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<MedicoDeCabeceraDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar([FromQuery] string? busqueda, CancellationToken ct)
        => Ok(await service.ListarAsync(MedicoDeCabeceraDto.FromEntity, busqueda, ct));

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear([FromBody] CatalogoNombreRequest request, CancellationToken ct)
    {
        var result = await service.CrearAsync(request.Nombre, ct);
        return result.Match(
            id => StatusCode(StatusCodes.Status201Created, new { id }),
            Problem);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Modificar(Guid id, [FromBody] CatalogoNombreRequest request, CancellationToken ct)
    {
        var result = await service.ModificarAsync(id, request.Nombre, ct);
        return result.Match(_ => NoContent(), Problem);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Eliminar(Guid id, CancellationToken ct)
    {
        var result = await service.EliminarAsync(id, ct);
        return result.Match(_ => NoContent(), Problem);
    }
}
