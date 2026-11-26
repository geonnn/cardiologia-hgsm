using Microsoft.AspNetCore.Identity;

namespace CardiologiaHGSM.Domain.Usuarios;

public class Usuario : IdentityUser<Guid>
{
    public const int MaxLongitudNombre = 50;
    public const int MaxLongitudApellido = 50;

    public string Nombre { get; private set; } = null!;
    public string Apellido { get; private set; } = null!;
    public DateTimeOffset FechaCarga { get; private set; }

    private Usuario() { }

    public static ErrorOr<Usuario> Crear(
        string nombre,
        string apellido,
        string email,
        DateTimeOffset? fechaCarga = null)
    {
        var errores = ValidarDatosPersonales(nombre, apellido);

        if (string.IsNullOrWhiteSpace(email))
            errores.Add(UsuarioErrors.EmailRequerido);

        if (errores.Count > 0)
            return errores;

        var emailNormalizado = email.Trim();

        return new Usuario
        {
            Id = Guid.CreateVersion7(),
            Nombre = nombre.Trim(),
            Apellido = apellido.Trim(),
            Email = emailNormalizado,
            UserName = emailNormalizado,
            FechaCarga = (fechaCarga ?? DateTimeOffset.UtcNow).ToUniversalTime()
        };
    }

    public ErrorOr<Success> ModificarDatosPersonales(string nombre, string apellido)
    {
        var errores = ValidarDatosPersonales(nombre, apellido);

        if (errores.Count > 0)
            return errores;

        this.Nombre = nombre.Trim();
        this.Apellido = apellido.Trim();

        return Result.Success;
    }

    private static List<Error> ValidarDatosPersonales(string nombre, string apellido)
    {
        var errores = new List<Error>();

        var nombreLimpio = nombre?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(nombreLimpio))
            errores.Add(UsuarioErrors.NombreRequerido);
        else if (nombreLimpio.Length > MaxLongitudNombre)
            errores.Add(UsuarioErrors.NombreMuyLargo);

        var apellidoLimpio = apellido?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(apellidoLimpio))
            errores.Add(UsuarioErrors.ApellidoRequerido);
        else if (apellidoLimpio.Length > MaxLongitudApellido)
            errores.Add(UsuarioErrors.ApellidoMuyLargo);

        return errores;
    }
}
