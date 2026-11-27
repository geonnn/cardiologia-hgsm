using CardiologiaHGSM.Domain.Camas;
using CardiologiaHGSM.Domain.Catalogos;
using CardiologiaHGSM.Domain.Enums;
using CardiologiaHGSM.Domain.Internaciones;
using CardiologiaHGSM.Domain.Pacientes;
using static CardiologiaHGSM.Infrastructure.Persistence.Seeding.DemoSeed;

namespace CardiologiaHGSM.Infrastructure.Persistence.Seeding;

internal sealed class DatosDemo(CardiologiaDbContext dbContext, PlanDemo plan, CatalogosDemo catalogos)
{
    private static readonly string[] NombresFemeninos =
        ["Elena", "María", "Lucía", "Inés", "Noemí", "Graciela", "Silvia", "Alicia", "Adriana", "Ángela", "Rosa", "Celia"];
    private static readonly string[] NombresMasculinos =
        ["Martín", "José", "Ramón", "Joaquín", "Héctor", "Julián", "Oscar", "Andrés", "Miguel", "Raúl", "Pablo", "Hugo"];
    private static readonly string[] Apellidos =
        ["Gómez", "Fernández", "Sosa", "Álvarez", "López", "Pérez", "Rodríguez", "Méndez", "Vera", "Suárez",
            "Gutiérrez", "Ríos", "Roldán", "Núñez", "Ibarra", "Benítez", "Díaz", "Quiroga", "Ruiz"];
    private static readonly string[] Parentescos = ["Pareja", "Hija", "Hijo", "Hermana", "Hermano"];

    private static readonly InformeDemo[] EstudiosDeIngreso =
    [
        new("Electrocardiograma", "ECG de ingreso", "Trazado de doce derivaciones incorporado a la historia clínica."),
        new("Ecocardiograma", "Ecocardiograma de ingreso", "Se documentaron la función ventricular y los hallazgos valvulares."),
        new("Laboratorio", "Laboratorio de ingreso", "Se adjuntaron hemograma, función renal y electrolitos.")
    ];

    private static readonly PerfilClinico[] Perfiles =
    [
        new("Insuficiencia cardíaca", "Disnea progresiva y edemas de miembros inferiores.",
            "Se revisaron el balance hídrico y el registro de peso.",
            new("Laboratorio", "Función renal de control", "Se incorporó el control de creatinina y electrolitos.")),
        new("Dolor torácico", "Episodios de opresión precordial en evaluación.",
            "Se registró la evolución del dolor y se comparó el ECG con el de ingreso.",
            new("Prueba de esfuerzo", "Prueba de esfuerzo de control", "Informe funcional incorporado al cierre de la evaluación.")),
        new("SCASEST", "Dolor precordial de reposo con cambios en los marcadores cardíacos.",
            "Se revisaron los trazados y los resultados seriados del laboratorio.",
            new("Cinecoronariografía", "Cinecoronariografía diagnóstica", "Informe de hemodinamia incorporado a la historia clínica.")),
        new("Fibrilación auricular", "Palpitaciones de inicio reciente y arritmia documentada.",
            "Se registraron el ritmo y la frecuencia cardíaca durante el monitoreo.",
            new("Holter", "Monitoreo ambulatorio de ritmo", "Se adjuntó el informe de los episodios registrados.")),
        new("Síncope", "Pérdida transitoria de conciencia con recuperación espontánea.",
            "Se revisó la telemetría y se interrogó sobre síntomas durante la movilización.",
            null),
        new("Hipertensión descompensada", "Lecturas elevadas de presión arterial con cefalea al ingreso.",
            "Se incorporó el registro de presión arterial de ambos turnos.",
            null),
        new("Valvulopatía", "Disnea de esfuerzo en paciente con valvulopatía conocida.",
            "Se revisó el informe ecocardiográfico con el equipo de sala.",
            new("Radiografía de tórax", "Radiografía de tórax de control", "Se adjuntó el informe comparativo con la placa previa.")),
        new("Pericarditis", "Dolor pleurítico y síndrome febril en evaluación.",
            "Se registraron el dolor y la curva térmica de la jornada.",
            new("Bacteriología", "Cultivos de control", "Se adjuntó el informe de las muestras obtenidas durante la internación."))
    ];

    private static readonly (string Titulo, string Descripcion)[] Tareas =
    [
        ("Revisar ECG", "Comparar el trazado con el último estudio disponible."),
        ("Confirmar laboratorio", "Verificar que el informe quede incorporado al historial."),
        ("Cargar ecocardiograma", "Adjuntar el informe firmado cuando esté disponible."),
        ("Completar antecedentes", "Confirmar los antecedentes consignados al ingreso."),
        ("Revisar telemetría", "Incorporar al pase el resumen del monitoreo."),
        ("Registrar peso", "Cargar el último control de peso en la evolución."),
        ("Actualizar contacto", "Verificar el contacto familiar de referencia."),
        ("Revisar medicación habitual", "Confirmar con el paciente el listado de medicación habitual."),
        ("Coordinar interconsulta", "Verificar la respuesta del equipo interconsultado."),
        ("Solicitar turno de control", "Coordinar la fecha del próximo control ambulatorio."),
        ("Completar resumen clínico", "Incorporar resultados y observaciones al resumen de internación."),
        ("Confirmar informe pendiente", "Consultar el estado del informe solicitado en el pase anterior.")
    ];

    public static IEnumerable<string> NombresTiposEstudio => EstudiosDeIngreso.Select(estudio => estudio.Tipo)
        .Concat(Perfiles.Select(perfil => perfil.EstudioAdicional?.Tipo).OfType<string>())
        .Distinct(StringComparer.OrdinalIgnoreCase);

    public static IEnumerable<string> NombresMotivos => Perfiles.Select(perfil => perfil.Motivo);

    public Paciente CrearPaciente(int numero, Dni dni, DateOnly diaCarga)
    {
        var femenino = numero % 2 == 0;
        var nombres = femenino ? NombresFemeninos : NombresMasculinos;
        var apellido = Apellidos[(numero * 7 + numero / 13) % Apellidos.Length];
        var nacimiento = plan.Hoy.AddYears(-(19 + numero * 13 % 73)).AddDays(-(numero * 37 % 365));
        var antecedentes = (numero % 5) switch
        {
            1 => "Registra controles cardiovasculares previos.",
            2 => "Antecedente de internación en otro centro.",
            3 => "Refiere seguimiento ambulatorio por disnea de esfuerzo.",
            _ => null
        };
        Guid? medicoId = numero % 4 == 0 ? null : catalogos.MedicosDeCabecera[numero % catalogos.MedicosDeCabecera.Length].Id;

        var paciente = Validar(Paciente.Crear(nombres[numero / 2 % nombres.Length], apellido, dni, nacimiento,
            femenino ? Sexo.Femenino : Sexo.Masculino, antecedentes, medicoId, plan.Instante(diaCarga, 8), plan.Hoy));

        for (var i = 0; i < numero % (Paciente.MaxContactos + 1); i++)
        {
            var nombre = NombresFemeninos[(numero + i) % NombresFemeninos.Length];
            var telefono = FormattableString.Invariant($"0000{numero:D5}{i:D2}");
            var contacto = Validar(Contacto.Crear(paciente.Id, nombre, telefono, i % 3 == 0 ? null : apellido,
                i % 3 == 2 ? null : Parentescos[i]));
            Validar(paciente.AgregarContacto(contacto));
        }

        var cantidadFactores = numero % 4 == 0 ? 0 : 1 + numero % 3;
        for (var i = 0; i < cantidadFactores; i++)
            Validar(paciente.AgregarFactorDeRiesgo(catalogos.FactoresDeRiesgo[(numero + i) % catalogos.FactoresDeRiesgo.Length]));

        return paciente;
    }

    public Internacion CrearInternacion(EpisodioDemo episodio, Paciente paciente, Cama cama, DateTimeOffset fechaIngreso)
    {
        var perfil = PerfilPara(episodio);
        var numero = episodio.NumeroPaciente;
        var motivos = new List<MotivoInternacion> { catalogos.MotivosInternacion[perfil.Motivo] };
        if (numero % 3 == 0 || episodio.EsInternacionActivaRecurrente)
        {
            var segundoMotivo = perfil.Motivo == "Dolor torácico" ? "Hipertensión descompensada" : "Dolor torácico";
            motivos.Add(catalogos.MotivosInternacion[segundoMotivo]);
        }

        var aislamiento = (episodio.Egreso, episodio.Sector, episodio.NumeroCama) switch
        {
            (null, Manejo.UCO, 4) => "Precauciones de contacto",
            (null, Manejo.Sala, 13) => "Aislamiento respiratorio",
            _ => null
        };
        var manejo = episodio is { Egreso: null, Sector: Manejo.Sala, NumeroCama: 1 } ? Manejo.UCO : cama.Sector;

        return Validar(Internacion.Crear(paciente.Id, cama.Id, manejo, perfil.Enfermedad, motivos, fechaIngreso,
            obraSocialId: numero % 5 == 0 ? null : catalogos.ObrasSociales[numero % catalogos.ObrasSociales.Length].Id,
            aislamiento: aislamiento,
            parametrosAntropometria: numero % 3 == 0 ? $"Peso {55 + numero % 43} kg. Talla {150 + numero % 42} cm." : null,
            tratamientoPrevio: numero % 3 == 1 ? "Refiere medicación cardiovascular habitual. Conciliación en curso." : null,
            observaciones: numero % 4 == 1 ? "Se registró el contacto de referencia para el próximo pase." : null,
            ahora: plan.Ahora));
    }

    public static CondicionAlta CondicionDeAlta(EpisodioDemo episodio)
    {
        if (episodio.NumeroPaciente == PlanDemo.PacienteRecurrente)
            return CondicionAlta.AltaHospitalaria;

        return (episodio.NumeroPaciente % 20) switch
        {
            0 => CondicionAlta.Obito,
            1 => CondicionAlta.RetiroVoluntario,
            <= 4 => CondicionAlta.Traslado,
            _ => CondicionAlta.AltaHospitalaria
        };
    }

    public void AgregarHistoria(EpisodioDemo episodio, Internacion internacion, HashSet<ClaveEstudioDemo> estudiosExistentes)
    {
        if (episodio.EsIngresoReciente)
            return;

        var perfil = PerfilPara(episodio);
        var ultimoDia = episodio.Egreso ?? plan.Hoy;

        foreach (var informe in EstudiosDeIngreso)
            AgregarEstudio(internacion.PacienteId, informe, episodio.Ingreso, estudiosExistentes);

        if (perfil.EstudioAdicional is { } adicional && episodio.Ingreso < ultimoDia)
            AgregarEstudio(internacion.PacienteId, adicional, episodio.Ingreso.AddDays(1), estudiosExistentes);

        for (var dia = episodio.Ingreso; dia <= ultimoDia; dia = dia.AddDays(1))
        {
            var jornada = dia.DayNumber - episodio.Ingreso.DayNumber;
            var fecha = plan.Instante(dia, 10);
            var nota = dia == episodio.Egreso
                ? "Se completó el resumen del episodio."
                : FormattableString.Invariant($"Registro del pase de sala del día {jornada + 1}.");
            dbContext.Evoluciones.Add(Validar(Evolucion.Crear(internacion.Id, $"{perfil.Seguimiento} {nota}", fecha, plan.Ahora)));

            if (jornada is 0 or 2 || episodio.EsInternacionActivaRecurrente)
            {
                var descripcion = jornada == 0
                    ? "Se registraron las indicaciones iniciales de la internación."
                    : $"Revisión de las indicaciones en el pase del día {jornada + 1}. {perfil.Seguimiento}";
                dbContext.Tratamientos.Add(Validar(Tratamiento.Crear(internacion.Id, descripcion, fecha, ahora: fecha)));
            }
        }

        var cantidadTareas = episodio.EsInternacionActivaRecurrente ? Tareas.Length : 2;
        for (var i = 0; i < cantidadTareas; i++)
        {
            var dia = episodio.Ingreso.AddDays(episodio.EsInternacionActivaRecurrente ? i : 0);
            var tarea = Tareas[(episodio.NumeroPaciente + i) % Tareas.Length];
            var pendiente = Validar(Pendiente.Crear(internacion.Id, tarea.Titulo, tarea.Descripcion, plan.Instante(dia, 11)));
            if (i % 2 == 0)
                Validar(pendiente.MarcarComoRealizado(plan.Instante(dia, 14)));
            dbContext.Pendientes.Add(pendiente);
        }
    }

    private void AgregarEstudio(Guid pacienteId, InformeDemo informe, DateOnly fecha, HashSet<ClaveEstudioDemo> estudiosExistentes)
    {
        var tipoId = catalogos.TiposEstudio[informe.Tipo].Id;
        var clave = new ClaveEstudioDemo(pacienteId, tipoId, informe.Titulo, fecha);
        if (estudiosExistentes.Add(clave))
            dbContext.Estudios.Add(Validar(Estudio.Crear(pacienteId, tipoId, informe.Titulo, fecha, informe.Descripcion, plan.Hoy)));
    }

    private static PerfilClinico PerfilPara(EpisodioDemo episodio) =>
        episodio.NumeroPaciente == PlanDemo.PacienteRecurrente ? Perfiles[0] : Perfiles[episodio.NumeroPaciente % Perfiles.Length];

    private sealed record InformeDemo(string Tipo, string Titulo, string Descripcion);
    private sealed record PerfilClinico(string Motivo, string Enfermedad, string Seguimiento, InformeDemo? EstudioAdicional);
}

internal readonly record struct ClaveEstudioDemo(Guid PacienteId, int TipoEstudioId, string Titulo, DateOnly Fecha);
