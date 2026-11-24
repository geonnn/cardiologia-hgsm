using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Memory;

namespace CardiologiaHGSM.WebApi.Common;

/// <summary>
/// Guarda las sesiones en el servidor: la cookie solo lleva un id (cifrado) y el ticket queda en memoria.
/// Así el logout (RF-04) elimina la sesión de verdad: una cookie copiada antes del logout deja de servir.
/// Al reiniciar la API las sesiones se pierden y hay que volver a iniciar sesión.
/// </summary>
public class MemoryCacheTicketStore(IMemoryCache cache) : ITicketStore
{
    private const string Prefijo = "sesion:";

    public async Task<string> StoreAsync(AuthenticationTicket ticket)
    {
        var key = Prefijo + Guid.NewGuid().ToString("N");
        await RenewAsync(key, ticket);
        return key;
    }

    public Task RenewAsync(string key, AuthenticationTicket ticket)
    {
        var opciones = new MemoryCacheEntryOptions();
        if (ticket.Properties.ExpiresUtc is { } expira)
            opciones.SetAbsoluteExpiration(expira);

        cache.Set(key, ticket, opciones);
        return Task.CompletedTask;
    }

    public Task<AuthenticationTicket?> RetrieveAsync(string key) =>
        Task.FromResult(cache.Get<AuthenticationTicket>(key));

    public Task RemoveAsync(string key)
    {
        cache.Remove(key);
        return Task.CompletedTask;
    }
}
