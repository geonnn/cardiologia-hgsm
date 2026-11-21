namespace CardiologiaHGSM.Domain.Pacientes;

public static class DniErrors
{
    public static readonly Error Requerido = Error.Validation(
        code: "Dni.Requerido",
        description: "El DNI es obligatorio.");

    public static readonly Error LongitudInvalida = Error.Validation(
        code: "Dni.LongitudInvalida",
        description: $"El DNI debe tener entre {Dni.MinLongitud} y {Dni.MaxLongitud} caracteres.");

    public static readonly Error FormatoInvalido = Error.Validation(
        code: "Dni.FormatoInvalido",
        description: "El DNI solo puede contener caracteres alfanuméricos.");
}
