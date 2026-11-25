namespace CardiologiaHGSM.Domain.Pacientes;

public static class ContactoErrors
{
    public static readonly Error NombreRequerido = Error.Validation(
        code: "Contacto.NombreRequerido",
        description: "El nombre del contacto es obligatorio.");

    public static readonly Error NombreMuyLargo = Error.Validation(
        code: "Contacto.NombreMuyLargo",
        description: $"El nombre del contacto no puede superar los {Contacto.MaxLongitudNombre} caracteres.");

    public static readonly Error ApellidoMuyLargo = Error.Validation(
        code: "Contacto.ApellidoMuyLargo",
        description: $"El apellido del contacto no puede superar los {Contacto.MaxLongitudApellido} caracteres.");

    public static readonly Error TelefonoRequerido = Error.Validation(
        code: "Contacto.TelefonoRequerido",
        description: "El teléfono del contacto es obligatorio.");

    public static readonly Error TelefonoInvalido = Error.Validation(
        code: "Contacto.TelefonoInvalido",
        description: $"El teléfono debe ser numérico y tener como máximo {Contacto.MaxLongitudTelefono} dígitos.");

    public static readonly Error ParentescoMuyLargo = Error.Validation(
        code: "Contacto.ParentescoMuyLargo",
        description: $"El parentesco no puede superar los {Contacto.MaxLongitudParentesco} caracteres.");
}
