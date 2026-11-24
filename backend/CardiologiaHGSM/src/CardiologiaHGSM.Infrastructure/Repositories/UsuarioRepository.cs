using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Usuarios;
using CardiologiaHGSM.Domain.Usuarios;
using CardiologiaHGSM.Infrastructure.Extensions;
using CardiologiaHGSM.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CardiologiaHGSM.Infrastructure.Repositories;

public class UsuarioRepository(CardiologiaDbContext context) : IUsuarioRepository
{
    // La base usa la collation de libc de Alpine (musl), que ordena por bytes: "Álvarez" quedaría después de "Zapata".
    // Para el orden alfabético se usa la collation ICU de español.
    private const string CollationEspanol = "es-x-icu";

    public async Task<PaginatedList<Usuario>> ListarAsync(
        int page = 1,
        int pageSize = 10,
        OrdenUsuarios orden = OrdenUsuarios.ApellidoAsc,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        string? email = null,
        string? nombre = null,
        string? apellido = null,
        CancellationToken ct = default)
    {
        var query = context.Users.AsNoTracking();

        // RF-08.3: cada criterio es opcional y se combinan con AND
        if (!string.IsNullOrWhiteSpace(email))
            query = query.Where(u => EF.Functions.ILike(u.Email!, $"%{email.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(nombre))
            query = query.Where(u => EF.Functions.ILike(u.Nombre, $"%{nombre.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(apellido))
            query = query.Where(u => EF.Functions.ILike(u.Apellido, $"%{apellido.Trim()}%"));

        // RF-08.2: las fechas se interpretan en la zona horaria del servidor (TZ=America/Argentina/Buenos_Aires)
        // y FechaCarga se guarda en UTC. FechaHasta es inclusiva (todo ese día).
        if (fechaDesde is { } desde)
        {
            var desdeUtc = InicioDelDiaUtc(desde);
            query = query.Where(u => u.FechaCarga >= desdeUtc);
        }

        if (fechaHasta is { } hasta)
        {
            var hastaUtc = InicioDelDiaUtc(hasta.AddDays(1));
            query = query.Where(u => u.FechaCarga < hastaUtc);
        }

        // RF-08.1
        query = orden switch
        {
            OrdenUsuarios.ApellidoDesc => query
                .OrderByDescending(u => EF.Functions.Collate(u.Apellido, CollationEspanol))
                .ThenByDescending(u => EF.Functions.Collate(u.Nombre, CollationEspanol)),
            OrdenUsuarios.FechaCargaDesc => query.OrderByDescending(u => u.FechaCarga),
            OrdenUsuarios.FechaCargaAsc => query.OrderBy(u => u.FechaCarga),
            _ => query
                .OrderBy(u => EF.Functions.Collate(u.Apellido, CollationEspanol))
                .ThenBy(u => EF.Functions.Collate(u.Nombre, CollationEspanol))
        };

        return await query.ToPaginatedListAsync(page, pageSize, ct);
    }

    private static DateTime InicioDelDiaUtc(DateOnly fecha) =>
        fecha.ToDateTime(TimeOnly.MinValue, DateTimeKind.Local).ToUniversalTime();
}
