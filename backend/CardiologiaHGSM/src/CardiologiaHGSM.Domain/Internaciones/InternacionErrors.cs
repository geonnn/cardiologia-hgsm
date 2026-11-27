namespace CardiologiaHGSM.Domain.Internaciones;

public static class InternacionErrors
{
    public static readonly Error NoEncontrada = Error.NotFound(
        code: "Internacion.NoEncontrada",
        description: "No se encontró la internación especificada.");

    public static readonly Error PacienteYaInternado = Error.Conflict(
        code: "Internacion.PacienteYaInternado",
        description: "El paciente ya tiene una internación activa.");

    public static readonly Error MotivoNoEncontrado = Error.NotFound(
        code: "Internacion.MotivoNoEncontrado",
        description: "Uno o más motivos de internación indicados no existen.");

    public static readonly Error ObraSocialNoEncontrada = Error.NotFound(
        code: "Internacion.ObraSocialNoEncontrada",
        description: "La obra social especificada no existe.");

    public static readonly Error CamaAislamientoIgualACamaAsignada = Error.Validation(
        code: "Internacion.CamaAislamientoIgualACamaAsignada",
        description: "La cama a bloquear por aislamiento no puede ser la misma cama asignada al paciente.");

    public static readonly Error CamaOcupadaSinInternacionActiva = Error.Conflict(
        code: "Internacion.CamaOcupadaSinInternacionActiva",
        description: "La cama destino figura ocupada pero no registra una internación activa asociada.");

    public static readonly Error RangoFechasInvalido = Error.Validation(
        code: "Internacion.RangoFechasInvalido",
        description: "La fecha desde no puede ser posterior a la fecha hasta.");

    public static readonly Error YaFinalizada = Error.Conflict(
        code: "Internacion.YaFinalizada",
        description: "La internación ya se encuentra finalizada.");

    public static readonly Error FechaIngresoFutura = Error.Validation(
        code: "Internacion.FechaIngresoFutura",
        description: "La fecha de ingreso no puede ser posterior a la fecha actual.");

    public static readonly Error FechaFinFutura = Error.Validation(
        code: "Internacion.FechaFinFutura",
        description: "La fecha de egreso no puede ser posterior a la fecha actual.");

    public static readonly Error FechaFinAnteriorAIngreso = Error.Validation(
        code: "Internacion.FechaFinAnteriorAIngreso",
        description: "La fecha de egreso no puede ser anterior a la fecha de ingreso.");

    public static readonly Error AislamientoMuyLargo = Error.Validation(
        code: "Internacion.AislamientoMuyLargo",
        description: $"El aislamiento no puede superar los {Internacion.MaxLongitudAislamiento} caracteres.");

    public static readonly Error EnfermedadActualRequerida = Error.Validation(
        code: "Internacion.EnfermedadActualRequerida",
        description: "La enfermedad actual es obligatoria.");

    public static readonly Error MotivosRequeridos = Error.Validation(
        code: "Internacion.MotivosRequeridos",
        description: "La internación debe tener al menos un motivo de internación.");

    public static readonly Error MotivoDuplicado = Error.Conflict(
        code: "Internacion.MotivoDuplicado",
        description: "El motivo de internación ya está asociado a esta internación.");

    public static readonly Error EvolucionDetalleRequerido = Error.Validation(
        code: "Evolucion.DetalleRequerido",
        description: "El detalle de la evolución es obligatorio.");

    public static readonly Error EvolucionFechaFutura = Error.Validation(
        code: "Evolucion.FechaFutura",
        description: "La fecha de la evolución no puede ser posterior a la fecha actual.");

    public static readonly Error TratamientoNoEncontrado = Error.NotFound(
        code: "Internacion.TratamientoNoEncontrado",
        description: "No se encontró el tratamiento especificado en la internación.");

    public static readonly Error SoloUltimoTratamientoModificable = Error.Conflict(
        code: "Internacion.SoloUltimoTratamientoModificable",
        description: "Solo se permite modificar el último tratamiento registrado.");

    public static readonly Error TratamientoDescripcionRequerida = Error.Validation(
        code: "Tratamiento.DescripcionRequerida",
        description: "La descripción del tratamiento es obligatoria.");

    public static readonly Error TratamientoFechaFueraDeRango = Error.Validation(
        code: "Tratamiento.FechaFueraDeRango",
        description: $"La fecha del tratamiento no puede diferir en más de {Tratamiento.MaxMesesDesfasaje} meses respecto a la fecha actual.");

    public static readonly Error PendienteNoEncontrado = Error.NotFound(
        code: "Internacion.PendienteNoEncontrado",
        description: "No se encontró el pendiente especificado en la internación.");

    public static readonly Error PendienteTituloRequerido = Error.Validation(
        code: "Pendiente.TituloRequerido",
        description: "El título del pendiente es obligatorio.");

    public static readonly Error PendienteTituloMuyLargo = Error.Validation(
        code: "Pendiente.TituloMuyLargo",
        description: $"El título del pendiente no puede superar los {Pendiente.MaxLongitudTitulo} caracteres.");

    public static readonly Error PendienteDescripcionRequerida = Error.Validation(
        code: "Pendiente.DescripcionRequerida",
        description: "La descripción del pendiente es obligatoria.");

    public static readonly Error PendienteYaRealizado = Error.Conflict(
        code: "Pendiente.YaRealizado",
        description: "El pendiente ya se encuentra marcado como realizado.");

    public static readonly Error PendienteNoRealizado = Error.Conflict(
        code: "Pendiente.NoRealizado",
        description: "El pendiente no se encuentra marcado como realizado.");

    public static readonly Error PendienteFechaResolucionAnteriorACarga = Error.Validation(
        code: "Pendiente.FechaResolucionAnteriorACarga",
        description: "La fecha de resolución del pendiente no puede ser anterior a su fecha de carga.");

    public static readonly Error PacienteSinInternacionActiva = Error.Conflict(
        code: "Internacion.PacienteSinInternacionActiva",
        description: "El paciente no tiene una internación activa.");

    public static readonly Error PendienteRangoFechasInvalido = Error.Validation(
        code: "Pendiente.RangoFechasInvalido",
        description: "La fecha desde no puede ser posterior a la fecha hasta.");
}
