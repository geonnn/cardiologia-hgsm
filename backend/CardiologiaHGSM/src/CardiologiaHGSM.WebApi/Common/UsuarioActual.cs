using System.Security.Claims;
using CardiologiaHGSM.Application.Common.Interfaces;
using Microsoft.IdentityModel.JsonWebTokens;

namespace CardiologiaHGSM.WebApi.Common;

public class UsuarioActual(IHttpContextAccessor httpContextAccessor) : IUsuarioActual
{
    public Guid? Id =>
        Guid.TryParse(httpContextAccessor.HttpContext?.User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var id)
            ? id
            : null;
}
