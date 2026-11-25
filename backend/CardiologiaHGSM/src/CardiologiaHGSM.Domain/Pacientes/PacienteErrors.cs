namespace CardiologiaHGSM.Domain.Pacientes;

public static class PacienteErrors
{
    public static readonly Error NombreRequerido = Error.Validation(
        code: "Paciente.NombreRequerido",
        description: "El nombre del paciente es obligatorio.");

    public static readonly Error NombreMuyLargo = Error.Validation(
        code: "Paciente.NombreMuyLargo",
        description: $"El nombre del paciente no puede superar los {Paciente.MaxLongitudNombre} caracteres.");

    public static readonly Error ApellidoRequerido = Error.Validation(
        code: "Paciente.ApellidoRequerido",
        description: "El apellido del paciente es obligatorio.");

    public static readonly Error ApellidoMuyLargo = Error.Validation(
        code: "Paciente.ApellidoMuyLargo",
        description: $"El apellido del paciente no puede superar los {Paciente.MaxLongitudApellido} caracteres.");

    public static readonly Error FechaNacimientoFutura = Error.Validation(
        code: "Paciente.FechaNacimientoFutura",
        description: "La fecha de nacimiento no puede ser posterior a la fecha actual.");

    public static readonly Error DniDuplicado = Error.Conflict(
        code: "Paciente.DniDuplicado",
        description: "Ya existe un paciente registrado con ese DNI.");

    public static readonly Error MaximoContactosAlcanzado = Error.Validation(
        code: "Paciente.MaximoContactosAlcanzado",
        description: $"Un paciente no puede tener más de {Paciente.MaxContactos} contactos.");

    public static readonly Error ContactoNoEncontrado = Error.NotFound(
        code: "Paciente.ContactoNoEncontrado",
        description: "No se encontró el contacto especificado en el paciente.");

    public static readonly Error FactorDeRiesgoDuplicado = Error.Conflict(
        code: "Paciente.FactorDeRiesgoDuplicado",
        description: "El factor de riesgo cardiovascular ya está asociado al paciente.");

    public static readonly Error FactorDeRiesgoNoEncontrado = Error.NotFound(
        code: "Paciente.FactorDeRiesgoNoEncontrado",
        description: "No se encontró el factor de riesgo especificado en el paciente.");

    public static readonly Error NoEncontrado = Error.NotFound(
        code: "Paciente.NoEncontrado",
        description: "No se encontró el paciente especificado.");

    public static readonly Error MedicoDeCabeceraNoEncontrado = Error.NotFound(
        code: "Paciente.MedicoDeCabeceraNoEncontrado",
        description: "No se encontró el médico de cabecera especificado.");

    public static readonly Error RangoFechasInvalido = Error.Validation(
        code: "Paciente.RangoFechasInvalido",
        description: "La fecha desde no puede ser posterior a la fecha hasta.");
}