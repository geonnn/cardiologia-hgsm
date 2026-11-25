using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace CardiologiaHGSM.WebApi.Controllers;

/// <summary>
/// Controller base: traduce los errores de ErrorOr a respuestas ProblemDetails (RFC 7807).
/// Validation -> 400 (con el detalle de cada error), NotFound -> 404, Conflict -> 409, etc.
/// </summary>
[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult Problem(List<Error> errors)
    {
        if (errors.Count == 0)
            return Problem();

        if (errors.All(e => e.Type == ErrorType.Validation))
            return ValidationProblem(errors);

        return Problem(errors[0]);
    }

    private IActionResult Problem(Error error)
    {
        var statusCode = error.Type switch
        {
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            ErrorType.Forbidden => StatusCodes.Status403Forbidden,
            _ => StatusCodes.Status500InternalServerError
        };

        var problem = ProblemDetailsFactory.CreateProblemDetails(
            HttpContext,
            statusCode: statusCode,
            title: error.Description);
        problem.Extensions["code"] = error.Code;

        return new ObjectResult(problem) { StatusCode = statusCode };
    }

    private IActionResult ValidationProblem(List<Error> errors)
    {
        foreach (var error in errors)
            ModelState.AddModelError(error.Code, error.Description);

        return ValidationProblem(ModelState);
    }
}
