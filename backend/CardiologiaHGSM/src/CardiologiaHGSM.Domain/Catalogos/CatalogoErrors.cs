namespace CardiologiaHGSM.Domain.Catalogos;

public static class CatalogoErrors
{
    public static readonly Error NombreRequerido = Error.Validation(
        code: "Catalogo.NombreRequerido",
        description: "El nombre es obligatorio.");

    public static Error NombreMuyLargo(int maxLongitud) => Error.Validation(
        code: "Catalogo.NombreMuyLargo",
        description: $"El nombre no puede superar los {maxLongitud} caracteres.");

    public static readonly Error NombreDuplicado = Error.Conflict(
        code: "Catalogo.NombreDuplicado",
        description: "Ya existe un registro con ese nombre.");

    public static readonly Error EnUso = Error.Conflict(
        code: "Catalogo.EnUso",
        description: "No se puede eliminar el registro porque se encuentra en uso.");

    public static readonly Error NoEncontrado = Error.NotFound(
        code: "Catalogo.NoEncontrado",
        description: "No se encontró el registro especificado en el catálogo.");
}
