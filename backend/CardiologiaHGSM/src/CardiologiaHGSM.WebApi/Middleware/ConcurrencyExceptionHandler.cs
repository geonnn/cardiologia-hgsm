using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.WebApi.Middleware;

/// <summary>
/// Traduce conflictos de concurrencia optimista (xmin / DbUpdateConcurrencyException)
/// a 409 Conflict en formato ProblemDetails (RFC 7807), consistente con ApiControllerBase.
/// </summary>
public sealed class ConcurrencyExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<ConcurrencyExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not DbUpdateConcurrencyException)
            return false;

        logger.LogWarning(
            exception,
            "Conflicto de concurrencia optimista en {Method} {Path}",
            httpContext.Request.Method,
            httpContext.Request.Path);

        httpContext.Response.StatusCode = StatusCodes.Status409Conflict;

        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "El registro fue modificado por otro usuario. Recargá los datos e intentá nuevamente.",
            Type = "https://tools.ietf.org/html/rfc9110#section-15.5.10"
        };
        problem.Extensions["code"] = "Concurrencia.Conflicto";

        var escrito = await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problem
        });

        if (!escrito)
            await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}
