using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Domain.Usuarios;

namespace CardiologiaHGSM.Application.Usuarios;

// El alta, baja y modificación de usuarios se hace con UserManager; este repositorio es solo para el listado.
public interface IUsuarioRepository
{
    Task<PaginatedList<Usuario>> ListarAsync(
        int page = 1,
        int pageSize = 10,
        OrdenUsuarios orden = OrdenUsuarios.ApellidoAsc,
        DateOnly? fechaDesde = null,
        DateOnly? fechaHasta = null,
        string? email = null,
        string? nombre = null,
        string? apellido = null,
        CancellationToken ct = default);
}
