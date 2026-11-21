namespace CardiologiaHGSM.Domain.Pacientes;

public static class EstudioErrors
{
    public static readonly Error NoEncontrado = Error.NotFound(
        code: "Estudio.NoEncontrado",
        description: "No se encontró el estudio especificado.");

    public static readonly Error TituloRequerido = Error.Validation(
        code: "Estudio.TituloRequerido",
        description: "El título del estudio es obligatorio.");

    public static readonly Error TituloMuyLargo = Error.Validation(
        code: "Estudio.TituloMuyLargo",
        description: $"El título del estudio no puede superar los {Estudio.MaxLongitudTitulo} caracteres.");

    public static readonly Error DescripcionRequerida = Error.Validation(
        code: "Estudio.DescripcionRequerida",
        description: "La descripción del estudio es obligatoria.");

    public static readonly Error FechaFutura = Error.Validation(
        code: "Estudio.FechaFutura",
        description: "La fecha del estudio no puede ser posterior a la fecha actual.");
}
