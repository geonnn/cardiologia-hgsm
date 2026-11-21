using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Domain.Usuarios;

public class Rol : IdentityRole<Guid>
{
    public const string Administrador = "Administrador";
    public const string Usuario = "Usuario";

    public static readonly IReadOnlyCollection<string> Todos = [Administrador, Usuario];

    private Rol() { }

    public static ErrorOr<Rol> Crear(string nombre)
    {
        if (!EsValido(nombre))
            return UsuarioErrors.RolInvalido;

        return new Rol
        {
            Id = Guid.CreateVersion7(),
            Name = nombre.Trim()
        };
    }

    public static bool EsValido(string? nombre) =>
        !string.IsNullOrWhiteSpace(nombre) &&
        Todos.Contains(nombre.Trim(), StringComparer.Ordinal);
}
