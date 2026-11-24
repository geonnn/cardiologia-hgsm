using CardiologiaHGSM.Domain.Usuarios;

namespace CardiologiaHGSM.Application.Usuarios.Dtos;

public sealed record UsuarioActualDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Email,
    IReadOnlyList<string> Roles)
{
    public static UsuarioActualDto FromEntity(Usuario usuario, IEnumerable<string> roles) => new(
        usuario.Id,
        usuario.Nombre,
        usuario.Apellido,
        usuario.Email!,
        roles.ToList()
    );
}
