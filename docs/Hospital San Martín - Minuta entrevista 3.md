# **Entrevista 3** 

**Proyecto: Servicio de Cardiología Hospital General San Martín** 

**Identificación: 03** 

Preparada por: Grupo 2. Fecha de preparación: 27/09/2026 

Fase en la que se encuentra el proyecto: Elicitación de requerimientos 

Documentos a los que se hacen referencias: - 

Lugar de la entrevista: Servicio de Cardiología, Hospital General San Martín, La Plata. 

Fecha/Hora/Duración de la entrevista: 29/09/2026 | 11:20 h | Duración 25 min 

Entrevistados: Lucas D’Angelo 

Rol: Jefe de residentes 

Objetivos a lograr con esta entrevista: 

Distinguir campos obligatorios de opcionales a partir de las distintas situaciones reales que puedan presentarse; entender el recorrido que realiza un paciente desde que ingresa a internación y se realiza la carga de sus datos, puntualizando la evolución de estos; desambiguar cuestiones puntuales correspondientes a la información obtenida en las entrevistas previas. 

## <u>Cuerpo de la entrevista:</u> 

**¿Qué diferencia hay entre "parámetros" y "antropometría"?** 

Actualmente no tienen un patrón fijo para registrar estos datos: a veces los ponen por separado y a veces juntos, en el encabezado del paciente junto al motivo de internación. "Parámetros" se refiere principalmente al peso, que se controla día a día en pacientes con insuficiencia cardíaca para hacer seguimiento del balance de líquidos. "Antropometría" incluye superficie corporal, peso y altura, y se completa en pacientes que requieren estudios como el ecocardiograma. Ninguno de los dos es obligatorio. Acuerdan que convendría separarlos en dos campos distintos. 

### **¿Les gustaría poder observar el estado físico de las camas?** 

Sí, les gustaría poder visualizar el estado de cada cama, indicando si se encuentra ocupada, libre, aislada, entre otros estados posibles. Esto permitiría conocer de manera rápida la disponibilidad y situación actual de las camas. 

### **¿Cuando cargan un estudio, indican la fecha en la que se realizó el estudio o la fecha de carga?** 

Se registra la fecha en la que se realizó el estudio, independientemente del momento en el que se realice su carga en el sistema. De esta manera, se puede mantener un historial cronológico y real de los distintos estudios realizados al paciente. 

**Nosotros vamos a instalar el sistema localmente. ¿Están de acuerdo con que el** **<u>departamento de sistemas se encargue de la instalación remota?</u>** 

Sí, están de acuerdo. Se deberá informar al departamento de sistemas para que se encargue de realizar y gestionar el despliegue del sistema de manera remota. 

**¿Qué información es necesaria para registrar un paciente en el sistema?** 

Como mínimo, es necesario registrar el nombre, apellido, DNI, el motivo o los motivos por los cuales ingresa el paciente, la enfermedad y el tratamiento actual. 

**¿Qué sucede si el paciente no puede otorgar los datos obligatorios del sistema, como nombre, apellido, DNI, etc.?** 

El paciente será internado igualmente. La información podrá ser cargada posteriormente, una vez que sea posible obtener los datos reales. Como alternativa, se podrá ingresar información temporal para permitir el registro inicial del paciente, la cual deberá ser reemplazada posteriormente por la información real. 

**¿Puede un paciente tener dos motivos de ingreso a la vez?** 

Sí, es posible. En determinadas situaciones, un paciente puede ingresar con una patología que todavía no ha sido identificada completamente. Por este motivo, resulta conveniente permitir registrar más de un posible motivo de ingreso o las principales sospechas existentes al momento de la internación. 

**¿Les gustaría tener una gráfica que muestre información de cada paciente?** 

No es necesario. Consideran que este tipo de representación gráfica no sería utilizada y, por lo tanto, no resulta una funcionalidad prioritaria para el sistema. 

**¿Les gustaría poder cargar archivos en el sistema?** 

No es necesario, ya que los archivos correspondientes a los resultados de los estudios se cargan actualmente en Remesi. Por este motivo, no consideran necesario incorporar una funcionalidad adicional para almacenar archivos dentro del sistema. 

**¿Es deseable que, si un paciente está en aislamiento, se bloqueen las camas adyacentes?** No sería lo ideal. Aunque una cama se encuentre ocupada por un paciente en aislamiento, las camas adyacentes podrían llegar a ser necesarias dependiendo de la capacidad disponible y de las necesidades de internación. Por lo tanto, no deberían bloquearse automáticamente. 

### **¿Qué sucede cuando hay un paciente que comparte el mismo contagio que el de una cama aislada?** 

En ese caso, la cama aislada puede ser liberada para asignársela al paciente que presenta el mismo contagio. De esta manera, se puede aprovechar la cama de aislamiento para un paciente que presenta una condición compatible con el aislamiento requerido. 

### **¿Qué sucede si no hay camas libres para una internación?** 

En caso de no disponer de camas libres, se pueden utilizar las camas que se encuentran aisladas por contagio, incluso si el paciente que requiere la internación no presenta el mismo contagio que originó el aislamiento de dicha cama. 

**¿Les gustaría poder separar la vista de la evolución de un paciente?** 

Sí, les gustaría contar con un apartado específico de Evoluciones, donde se puedan cargar y consultar las distintas evoluciones del paciente. Esto permitiría mantener un seguimiento más ordenado de los cambios en su estado a lo largo de la internación. 

### **El estudio complementario “Laboratorio” será tratado en formato texto, en donde podrán cargar los distintos resultados. ¿Están de acuerdo con esto?** 

Sí, están de acuerdo con que el estudio complementario “Laboratorio” sea registrado en formato texto. Esta decisión se debe a la gran cantidad y variedad de información que puede contener un estudio de laboratorio, así como a la complejidad y diversidad de los valores obtenidos. Por este motivo, consideran que utilizar un campo de texto permite mayor flexibilidad para registrar los distintos resultados, evitando limitar la información mediante campos estructurados que podrían no contemplar todas las situaciones posibles. De esta manera, se busca facilitar la carga de los resultados y conservar la información relevante de cada estudio. 

## <u>Conclusión de la entrevista</u> 

### Informe final: 

Se describió y explicó la idea general del sistema a desarrollar, con énfasis en el flujo de carga de datos de los pacientes y su posterior visualización. Se obtuvo confirmación de cada atributo que debe estar presente al momento de cargar un paciente, de su obligatoriedad y de su cardinalidad. 

## <u>Información obtenida en detalle:</u> 

**Campos que registran en las notas (actualización de la entrevista 2) incluyendo información sobre su tipo, obligatoriedad y cardinalidad:** 

- **Cama (obligatorio):** número/identificador de cama. 

- **Datos filiatorios:** 

   - Nombre (obligatorio, en caso de no tenerlo, prefieren cargar NN). 

   - Apellido (obligatorio, en caso de no tenerlo, prefieren cargar NN). 

   - Sexo (obligatorio, M/F/X). 

   - Edad / Fecha de nacimiento (opcional). 

   - DNI (obligatorio). 

   - Obra social (obligatorio, con opción de no tener). 

   - Médico de cabecera (obligatorio, con opción de no tener). 

   - Fecha de ingreso (obligatorio). Establecida por defecta la fecha actual, en caso de ser necesario otra fecha podrá ser registrada. 

   - Teléfono de uno o varios familiares/contactos (opcional, pueden ser más de uno). 

- **Motivo de Internación (MI) (obligatorio, pueden ser más de uno):** título corto, generalmente una patología. 

- **Tipo de tratamiento (obligatorio):** indica si el paciente requiere manejo de sala o manejo de coronaria, lo que da la posibilidad de representar pacientes en estado crítico que se encuentran físicamente en una cama de sala. 

- **Aislamiento (opcional):** campo de texto libre u observación. Indica si el paciente requiere alguna precaución de contacto (por ejemplo, aislamiento de contacto o aislamiento respiratorio). 

- **Parámetros (opcional):** campo separado de antropometría. Se usa principalmente para el control diario de peso en pacientes con insuficiencia cardíaca, como seguimiento del balance de líquidos. 

- **Antropometría (opcional):** campo separado de parámetros. Incluye superficie corporal, peso y altura; se completa en pacientes que requieren estudios como el ecocardiograma. 

- **Antecedentes (opcional):** campo propio, separado de la enfermedad actual (por ejemplo, antecedentes oncológicos), para facilitar búsquedas de pacientes por antecedentes específicos. 

- **Factores de riesgo cardiovasculares (FRCV, opcional, pueden ser más de uno):** campo separado, con valores conocidos y frecuentes, candidato a estandarizarse mediante una selección. 

- **Enfermedad actual (obligatorio):** texto libre. 

- **Tratamiento previo (opcional):** medicación que el paciente tomaba antes de la internación (por ejemplo, anticoagulantes o antihipertensivos). Se ubica antes de los estudios complementarios. 

- **Estudios complementarios (opcional):** variable según el paciente, todo estudio complementario es cargado como texto libre. 

   - Electrocardiograma (ECG), Ecocardiograma (ETT) y Laboratorio: se realizan siempre. 

   - Bacteriología y otros estudios: se registran sólo cuando corresponde (por ejemplo, ante fiebre y toma de cultivos). 

   - Cada estudio se registra con fecha en que se realizó (día, mes y año); si no se cuenta con el día exacto, al menos mes y año y se acumulan a lo largo de la internación. 

   - Laboratorio (panel base habitual): glóbulos blancos, hematocrito, hemoglobina, plaquetas, concentración de protrombina, glucemia, urea, creatinina, NT-proBNP, troponinas, sodio y potasio. Texto libre. 

- **Evolución (de la internación):** campo nuevo, separado de estudios complementarios. Registro cronológico de eventos relevantes durante la internación (fecha + descripción breve). No se completa todos los días, solo cuando hay una novedad. 

- **Tratamiento actual (obligatorio):** texto, tratamiento instaurado durante la internación. Toda internación posee un tratamiento, de esto habría que registrar evolución. o sea mantener visible un historial de modificaciones del tratamiento actual. 

- **Conducta/Pendiente:** campo único (no se separa). Incluye tareas o estudios pendientes de resolver y también el alta, cuando corresponda. 

### **Gestión de camas:** 

- Unidad coronaria: camas 1 a 7. Sala: camas 1 a 20 (la numeración se repite entre sectores). Hay 27 camas disponibles en total, aunque no todas están habilitadas en todo momento. 

- Un paciente puede cambiar de cama y de sector durante la internación (por ejemplo, de sala a unidad coronaria o viceversa). 

- Cuando dos camas contiguas están afectadas por el mismo motivo de aislamiento, se registran como un rango (por ejemplo, "9-10"). 

- Al registrar un paciente con aislamiento se debe poder bloquear otra cama, representando el aislamiento físico. 

- Un paciente que comparte el contagio de una cama aislada podrá ser asignado a esa cama. 

- Si no hay camas disponibles se asignan las camas aisladas a los internados, sin importar si estos comparten la patología del aislamiento. 

- Se busca poder indicar si el manejo de un paciente es de unidad coronaria o de sala en forma independiente de la cama física en la que se encuentra, para los casos en que un paciente crítico deba ubicarse temporalmente en una cama de sala (o viceversa). 

Documentos que se deben entregar: Documento entrevista 3. 

Documentos que debe entregar el entrevistado: - 

