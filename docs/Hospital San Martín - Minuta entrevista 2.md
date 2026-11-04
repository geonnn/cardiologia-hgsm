# **Entrevista 2** 

**Proyecto: Servicio de Cardiología Hospital General San Martín Identificación: 02** 

Preparada por: Grupo 2. 

Fecha de preparación: 20/09/2026 

Fase en la que se encuentra el proyecto: Elicitación de requerimientos 

Documentos a los que se hacen referencias: - 

Lugar de la entrevista: Servicio de Cardiología, Hospital General San Martín, La Plata. 

Fecha/Hora/Duración de la entrevista: 22/09/2026 | 10:00 h | Duración 30 min 

Entrevistados: Lucas D’Angelo 

Rol: Jefe de residentes 

Objetivo a lograr con esta entrevista: 

Validar y profundizar la información relevada en la primera entrevista sobre la estructura de datos que debe registrar el sistema, confirmando y precisando los campos de la nota de paciente, resolviendo los puntos que habían quedado pendientes y relevando nuevos requerimientos sobre la gestión de camas, la incorporación de nuevos valores al sistema y las búsquedas de información. 

<u>Cuerpo de la entrevista:</u> 

**¿Coinciden los campos filiatorios relevados en la entrevista anterior con lo que efectivamente registran?** 

Confirman los campos de cama y datos filiatorios relevados previamente (número de cama, nombre, apellido, sexo, edad, documento, entre otros). El orden en que se completan estos campos no es relevante. 

### **¿Qué es el campo "aislamiento" y cómo lo registran?** 

El aislamiento indica si el paciente requiere alguna precaución de contacto, por ejemplo aislamiento de contacto o aislamiento respiratorio. No es un valor estructurado sino una observación breve que describe el tipo de aislamiento. Si bien los tipos que utilizan son siempre los mismos y podrían estandarizarse, prefieren dejarlo como un campo de texto libre u observación, ya que es un dato poco frecuente y no es obligatorio. 

### **¿Qué diferencia hay entre "parámetros" y "antropometría"?** 

Actualmente no tienen un patrón fijo para registrar estos datos: a veces los ponen por separado y a veces juntos, en el encabezado del paciente junto al motivo de internación. "Parámetros" se refiere principalmente al peso, que se controla día a día en pacientes con insuficiencia cardíaca para hacer seguimiento del balance de líquidos. "Antropometría" incluye superficie corporal, peso y altura, y se completa en pacientes que requieren estudios como el ecocardiograma. Ninguno de los dos es obligatorio. Acuerdan que convendría separarlos en dos campos distintos. 

### **¿Cómo registran los antecedentes del paciente?** 

Actualmente los antecedentes no constituyen un campo separado: se desarrollan dentro del texto de "enfermedad actual" (por ejemplo, "paciente con antecedentes de hipertensión e hipotiroidismo"). Se acuerda incorporar los antecedentes como un campo propio, separado de la enfermedad actual, ya que esto facilitará realizar búsquedas de pacientes por antecedentes específicos (por ejemplo, antecedentes oncológicos). 

### **¿Qué estudios complementarios registran y cuáles son fijos?** 

El electrocardiograma, el ecocardiograma y el laboratorio se realizan siempre, a todos los pacientes. La bacteriología, en cambio, es variable y sólo se registra cuando corresponde (por ejemplo, si el paciente tiene fiebre y se le realizan cultivos). En general, la cantidad y el tipo de estudios complementarios varía según el paciente. 

### **¿Qué parámetros registran habitualmente en el laboratorio?** 

Manejan un panel base que se repite en la mayoría de los pacientes: glóbulos blancos, hematocrito, hemoglobina, plaquetas, concentración de protrombina, glucemia, urea, creatinina, NT-proBNP, troponinas, sodio y potasio. Cuando aparece algún resultado adicional que no forma parte de este panel, lo agregan como un dato extra, indicando la variable y su valor. Si no es una variable común, a veces, pueden agregar un comentario indicando qué representa el valor que toma esa variable (por ejemplo, bajo, normal, alto, etc.). 

### **¿Registran el tratamiento previo del paciente?** 

Sí. Antes de los estudios complementarios registran el tratamiento previo, es decir, la medicación que el paciente ya tomaba antes de la internación (por ejemplo, anticoagulantes o antihipertensivos). 

### **¿Cómo manejan la conducta y los pendientes?** 

Tratan "conducta" y "pendiente" como un mismo campo, ya que ambos refieren a lo que hay que resolver con el paciente (por ejemplo, solicitar un estudio o un cateterismo) y a lo que queda para la guardia siguiente. Consideraron separarlos, pero prefieren mantenerlos juntos porque sería más engorroso de gestionar. El alta también se registra dentro de este mismo campo, como un tipo de conducta (por ejemplo, "alta" cuando el paciente está en condiciones de irse, o la aclaración de qué se está esperando para definirla). 

### **¿Tienen un orden establecido para completar estos campos?** 

Sí, respetan desde hace varios años un orden similar al que fueron mostrando durante la entrevista (y a los documentos que nos facilitaron en la entrevista anterior), con algunas modificaciones a lo largo del tiempo. Consideran que es un formato bastante acertado. 

### **¿Cómo gestionan los estudios complementarios cuando un paciente tiene estudios de varias fechas?** 

Un paciente puede tener múltiples estudios a lo largo del tiempo (por ejemplo, ecocardiogramas de distintos años). No siempre registran todos: si un estudio no muestra cambios respecto del anterior, puede no incluirse, pero si hay un cambio relevante (por ejemplo, una caída en la función cardíaca) sí lo registran. A todos los estudios les asignan una fecha; si no cuentan con el día exacto, registran al menos el mes y el año. 

### **¿Registran pacientes ambulatorios o solo internados?** 

Sólo registran pacientes internados, tanto los que están en la unidad coronaria como en sala. 

**¿Cómo organizan y diferencian las camas de unidad coronaria y de sala?** Físicamente, la unidad coronaria ocupa las camas de la 1 a la 7, mientras que la sala se extiende de la 1 a la 20 (los números de cama se repiten entre ambos sectores, por lo que una "cama 1" puede corresponder a la unidad coronaria o a la sala). En total hay 27 camas disponibles, aunque no todas están habilitadas en un momento dado. Cuando dos camas contiguas están afectadas por el mismo motivo de aislamiento, lo anotan como un rango (por ejemplo, "9-10") junto al motivo de internación, en el encabezado del paciente, para que sea visible de inmediato. 

### **¿El sistema debería gestionar la información por cama o por paciente?** 

Prefieren gestionarlo por cama, ya que los pacientes pueden cambiar de cama durante la internación (por ejemplo, si un paciente de sala se agrava y pasa a la unidad coronaria, o al revés), y también por otros motivos, como reorganizar pacientes por sexo cuando se libera una cama. 

**¿Cómo indican si un paciente es crítico o no, más allá de la cama en la que se encuentra?** Puede darse el caso de que un paciente crítico deba quedar físicamente en una cama de sala (por ejemplo, si la unidad coronaria está completa), y viceversa. En esos casos, avisan al personal de enfermería para que reciba el mismo monitoreo que si estuviera en la unidad coronaria. Además de la ubicación física, ven de utilidad contar con una indicación de manejo (unidad coronaria o sala) que sea independiente de la cama asignada. 

### **¿Cómo gestionan la evolución diaria de un paciente durante la internación?** 

La evolución médica formal se registra en Remesi, el sistema oficial. En Evernote, en cambio, no registran una evolución diaria completa: solo anotan cuando ocurre algo relevante o el paciente "intercurre" con algo (por ejemplo, un empeoramiento que motiva su pase a la unidad coronaria), indicando la fecha y una breve descripción. Si la evolución es favorable y no hay novedades, no anotan nada ese día. Actualmente este registro se ubica debajo de los estudios complementarios, sin un apartado propio, lo que genera confusión entre los estudios realizados y los eventos del día a día. Se acuerda separarlos en dos apartados distintos: "estudios complementarios", donde quedarían únicamente los estudios realizados (cada uno con su fecha), y un nuevo apartado de "evolución" (o "evolución de la internación"), con el registro cronológico de los eventos relevantes. 

**¿Registran quién escribe cada entrada de información?** 

No están interesados en registrar quién carga o modifica cada dato. Señalan que, en la práctica, ya saben quién está de guardia y quién maneja cada sector en cada turno, por lo que no lo consideran necesario. 

### **¿Cómo manejan la aparición de un dato que todavía no existe en el sistema (una nueva patología o un nuevo parámetro de laboratorio)?** 

Prefieren que cualquier residente pueda agregar el dato nuevo en el momento en que lo necesita (por ejemplo, al cargar el motivo de internación), sin depender de un rol administrador que lo gestione, ya que las guardias van rotando y no siempre va a estar disponible una persona a cargo. Si surge un dato nuevo, avisan al equipo para consensuar cómo lo van a nombrar o codificar, y ese mismo valor queda disponible para que todos lo reutilicen en las cargas siguientes. 

### **¿Cómo realizan hoy las búsquedas de información?** 

Generalmente buscan por nombre o documento (DNI). Reconocen que esto también es una limitación del sistema actual: si el nombre o apellido está tipeado con una variante (por ejemplo, con "s" en vez de "z", o con doble letra), la búsqueda no encuentra al paciente. También les interesa poder buscar por patología, aunque hoy el sistema no permite acotar la búsqueda a un campo específico: si buscan una sigla como "ICD" (insuficiencia cardíaca descompensada), el resultado incluye cualquier nota donde aparezca esa sigla, sin distinguir si corresponde al motivo de internación, a la enfermedad actual o a un antecedente. Además, una misma patología puede estar escrita de formas distintas (ICD, IC descompensada, IC-D, entre otras), lo que también dificulta la búsqueda. 

### **¿Les gustaría poder agregar una descripción u observación a los valores que se completan mediante parámetros?** 

Sí, les gustaría poder combinar ambas cosas: un valor parametrizado y, opcionalmente, una observación breve. Esto es útil sobre todo para parámetros de laboratorio poco habituales, donde agregan una nota indicando si el valor es normal, alto o bajo. Para los parámetros que manejan habitualmente no lo consideran necesario, ya que conocen de memoria los rangos normales. 

## <u>Conclusión de la entrevista</u> 

### Informe final: 

Se profundizó y validó la estructura de datos relevada en la primera entrevista, precisando la definición de varios campos de la nota de paciente (aislamiento, parámetros, antropometría, antecedentes, tratamiento previo, estudios complementarios y evolución) y acordando su separación en campos propios cuando correspondía. Se relevó además información sobre la organización y gestión de camas y sectores (unidad coronaria y sala), el mecanismo previsto para incorporar nuevos valores al sistema (motivos de internación, parámetros de laboratorio) y las limitaciones actuales para realizar búsquedas por patología. No se registró interés en un rol de administrador para la gestión de estos datos ni en registrar la autoría de cada carga. 

## <u>Información obtenida en detalle:</u> 

### **Campos de la nota del paciente (actualización de la entrevista 1):** 

- **Cama:** número/identificador de cama. 

- **Datos filiatorios:** Nombre, Apellido, Sexo, Edad, Fecha de nacimiento, DNI, Obra social (opcional), Médico de cabecera (opcional), Fecha de ingreso, Teléfono de uno o varios familiares/contactos. 

- **Motivo de Internación (MI):** título corto, generalmente una patología. 

- **Aislamiento:** campo de texto libre u observación, no obligatorio. Indica si el paciente requiere alguna precaución de contacto (por ejemplo, aislamiento de contacto o aislamiento respiratorio). 

- **Parámetros:** campo separado de antropometría, no obligatorio. Se usa principalmente para el control diario de peso en pacientes con insuficiencia cardíaca, como seguimiento del balance de líquidos. 

- **Antropometría:** campo separado de parámetros, no obligatorio. Incluye superficie corporal, peso y altura; se completa en pacientes que requieren estudios como el ecocardiograma. 

- **Antecedentes:** campo propio, separado de la enfermedad actual (por ejemplo, 

   - antecedentes oncológicos), para facilitar búsquedas de pacientes por antecedentes específicos. 

- **Factores de riesgo (FR):** campo separado, con valores conocidos y frecuentes, 

candidato a estandarizarse mediante una selección. 

- **Enfermedad actual:** texto libre. 

- **Tratamiento previo:** medicación que el paciente tomaba antes de la internación (por ejemplo, anticoagulantes o antihipertensivos). Se ubica antes de los estudios complementarios. 

- **Estudios complementarios:** variable según el paciente. 

   - Electrocardiograma (ECG), Ecocardiograma (ETT) y Laboratorio: se realizan siempre. 

   - Bacteriología y otros estudios: se registran sólo cuando corresponde (por ejemplo, ante fiebre y toma de cultivos). 

   - Cada estudio se registra con fecha (día, mes y año; si no se cuenta con el día exacto, al menos mes y año) y se acumulan a lo largo de la internación. 

   - **Laboratorio (panel base habitual):** glóbulos blancos, hematocrito, hemoglobina, plaquetas, concentración de protrombina, glucemia, urea, creatinina, NT-proBNP, troponinas, sodio y potasio. Los parámetros adicionales no habituales se agregan como par variable/valor, con una observación opcional (normal, alto o bajo). 

- **Evolución (de la internación):** campo nuevo, separado de estudios complementarios. Registro cronológico de eventos relevantes durante la internación (fecha + descripción breve). No se completa todos los días, solo cuando hay una novedad. 

- **Tratamiento actual:** texto, tratamiento instaurado durante la internación. 

- **Conducta/Pendiente:** campo único (no se separa). Incluye tareas o estudios pendientes de resolver y también el alta, cuando corresponda. 

### **Gestión de camas:** 

- Unidad coronaria: camas 1 a 7. Sala: camas 1 a 20 (la numeración se repite entre sectores). Hay 27 camas disponibles en total, aunque no todas están habilitadas en todo momento. 

- Un paciente puede cambiar de cama y de sector durante la internación (por ejemplo, de sala a unidad coronaria o viceversa). 

- Cuando dos camas contiguas están afectadas por el mismo motivo de aislamiento, se registran como un rango (por ejemplo, "9-10"). 

- La información se gestionará por cama (no por paciente), permitiendo reasignar camas. 

- Se busca poder indicar si el manejo de un paciente es de unidad coronaria o de sala en forma independiente de la cama física en la que se encuentra, para los casos en que un paciente crítico deba ubicarse temporalmente en una cama de sala (o viceversa). 

### **Gestión de nuevos valores (motivos de internación, parámetros, etc.):** 

- Cualquier residente puede agregar un valor nuevo en el momento en que lo necesita, sin depender de un rol administrador que lo gestione (las guardias rotan y no siempre hay una persona a cargo disponible). 

- Ante un valor nuevo, el equipo lo consensúa informalmente (por ejemplo, avisando al grupo) y ese valor queda disponible para las próximas cargas, evitando duplicados. 

- No están interesados en registrar la autoría de cada carga (quién completó o modificó un dato); en la práctica identifican quién está de guardia por otros medios. 

### **Pacientes registrados:** 

- Solo pacientes internados, tanto de unidad coronaria como de sala. No se registran pacientes ambulatorios. 

### **Búsquedas:** 

- Actualmente buscan por nombre o DNI. 

- El sistema actual no permite acotar la búsqueda a un campo específico (por ejemplo, distinguir si una sigla aparece en el motivo de internación, en la enfermedad actual o en un antecedente). 

- Las variantes de tipeo y las distintas formas de abreviar una misma patología (por ejemplo, ICD, IC descompensada, IC-D) dificultan encontrar resultados. 

<u>Información pendiente:</u> 

- Relevar el circuito completo que realiza un paciente del servicio de cardiología (desde la llegada, atención en consultorio y realización de estudios, hasta el alta o derivación). 

- Definir el diseño final del campo que indique si el manejo de un paciente es de unidad coronaria o de sala, en forma independiente de la cama física asignada. 

- Definir si el consenso informal para incorporar nuevos valores (motivos de internación, parámetros de laboratorio) se reflejará de alguna forma dentro del sistema (por ejemplo, una notificación al agregarse un valor nuevo) o quedará por fuera de él. 

- Confirmar la lista definitiva de valores a estandarizar para factores de riesgo y motivo de internación. 

Documentos que se deben entregar: Documento entrevista 2. Documentos que debe entregar el entrevistado: - Próxima entrevista: 29/09/2026 10:30 h 

