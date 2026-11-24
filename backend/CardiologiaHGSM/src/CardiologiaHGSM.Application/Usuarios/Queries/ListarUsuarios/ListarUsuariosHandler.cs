using CardiologiaHGSM.Application.Common.Interfaces;
using CardiologiaHGSM.Application.Common.Models;
using CardiologiaHGSM.Application.Usuarios.Dtos;
using ErrorOr;

namespace CardiologiaHGSM.Application.Usuarios.Queries.ListarUsuarios;

public class ListarUsuariosHandler(
    IUsuarioRepository usuarioRepository
) : IQueryHandler<ListarUsuariosQuery, PaginatedList<UsuarioDto>>
{
    public async Task<ErrorOr<PaginatedList<UsuarioDto>>> HandleAsync(ListarUsuariosQuery query, CancellationToken ct = default)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 5, 100);

        var usuarios = await usuarioRepository.ListarAsync(
            page,
            pageSize,
            query.Orden,
            query.FechaDesde,
            query.FechaHasta,
            query.Email,
            query.Nombre,
            query.Apellido,
            ct);

        return usuarios.Map(UsuarioDto.FromEntity);
    }
}
