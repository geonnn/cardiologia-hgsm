using CardiologiaHGSM.Domain.Usuarios;

namespace CardiologiaHGSM.Application.Usuarios.Dtos;

public sealed record UsuarioDto(
    Guid Id,
    string Nombre,
    string Apellido,
    string Email,
    DateTime FechaCarga)
{
    public static UsuarioDto FromEntity(Usuario usuario) => new(
        usuario.Id,
        usuario.Nombre,
        usuario.Apellido,
        usuario.Email!,
        usuario.FechaCarga
    );
}
