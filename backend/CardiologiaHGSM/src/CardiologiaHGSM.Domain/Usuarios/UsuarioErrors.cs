namespace CardiologiaHGSM.Domain.Usuarios;

public static class UsuarioErrors
{
    public static readonly Error NombreRequerido = Error.Validation(
        code: "Usuario.NombreRequerido",
        description: "El nombre es obligatorio.");

    public static readonly Error NombreMuyLargo = Error.Validation(
        code: "Usuario.NombreMuyLargo",
        description: $"El nombre no puede superar los {Usuario.MaxLongitudNombre} caracteres.");

    public static readonly Error ApellidoRequerido = Error.Validation(
        code: "Usuario.ApellidoRequerido",
        description: "El apellido es obligatorio.");

    public static readonly Error ApellidoMuyLargo = Error.Validation(
        code: "Usuario.ApellidoMuyLargo",
        description: $"El apellido no puede superar los {Usuario.MaxLongitudApellido} caracteres.");

    public static readonly Error EmailRequerido = Error.Validation(
        code: "Usuario.EmailRequerido",
        description: "El correo electrónico es obligatorio.");

    public static readonly Error EmailDuplicado = Error.Conflict(
        code: "Usuario.EmailDuplicado",
        description: "Ya existe un usuario registrado con ese correo electrónico.");

    public static readonly Error NoEncontrado = Error.NotFound(
        code: "Usuario.NoEncontrado",
        description: "No se encontró el usuario especificado.");

    public static readonly Error CredencialesInvalidas = Error.Unauthorized(
        code: "Usuario.CredencialesInvalidas",
        description: "Las credenciales ingresadas son inválidas.");

    public static readonly Error RolInvalido = Error.Validation(
        code: "Usuario.RolInvalido",
        description: "El rol especificado no es válido.");
}
