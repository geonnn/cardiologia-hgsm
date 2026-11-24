using System.Security.Claims;
using CardiologiaHGSM.Application.Common.Interfaces;

namespace CardiologiaHGSM.WebApi.Common;

public class UsuarioActual(IHttpContextAccessor httpContextAccessor) : IUsuarioActual
{
    public Guid? Id =>
        Guid.TryParse(httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
            ? id
            : null;
}
