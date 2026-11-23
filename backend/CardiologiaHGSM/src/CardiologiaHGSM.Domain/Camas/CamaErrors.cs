namespace CardiologiaHGSM.Domain.Camas;

public static class CamaErrors
{
    public static readonly Error NumeroInvalido = Error.Validation(
        code: "Cama.NumeroInvalido",
        description: "El número de cama debe ser mayor a 0.");

    public static readonly Error NumeroDuplicado = Error.Conflict(
        code: "Cama.NumeroDuplicado",
        description: "Ya existe una cama con ese número en el sector indicado.");

    public static readonly Error NoEncontrada = Error.NotFound(
        code: "Cama.NoEncontrada",
        description: "No se encontró la cama especificada.");

    public static readonly Error YaOcupada = Error.Conflict(
        code: "Cama.YaOcupada",
        description: "La cama ya se encuentra ocupada.");

    public static readonly Error YaDisponible = Error.Conflict(
        code: "Cama.YaDisponible",
        description: "La cama ya se encuentra disponible.");

    public static readonly Error YaEnAislamiento = Error.Conflict(
        code: "Cama.YaEnAislamiento",
        description: "La cama ya se encuentra en aislamiento.");

    public static readonly Error YaDeshabilitada = Error.Conflict(
        code: "Cama.YaDeshabilitada",
        description: "La cama ya se encuentra deshabilitada.");

    public static readonly Error EnAislamiento = Error.Conflict(
        code: "Cama.EnAislamiento",
        description: "No se puede realizar la operación porque la cama se encuentra en aislamiento.");

    public static readonly Error Deshabilitada = Error.Conflict(
        code: "Cama.Deshabilitada",
        description: "No se puede realizar la operación porque la cama se encuentra deshabilitada.");

    public static readonly Error NoEstaEnAislamiento = Error.Conflict(
        code: "Cama.NoEstaEnAislamiento",
        description: "Solo se puede desbloquear una cama que se encuentre en aislamiento.");

    public static readonly Error NoEstaDeshabilitada = Error.Conflict(
        code: "Cama.NoEstaDeshabilitada",
        description: "Solo se puede habilitar una cama que se encuentre deshabilitada.");
}
