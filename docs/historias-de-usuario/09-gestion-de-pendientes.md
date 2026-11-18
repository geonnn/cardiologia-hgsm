# Épica: Gestión de Pendientes (`EPIC-PENDIENTES`)

## Descripción general
Esta épica abarca el manejo de la lista de tareas y conductas asistenciales pendientes del paciente internado, fundamental para la continuidad de cuidados en los pases de guardia. Permite dar de alta pendientes, consultar tareas activas o completadas, aplicar filtros y marcar la realización de las mismas registrando la fecha de resolución de forma automática.

---

## Historias de Usuario

### HU-32: Agregar pendiente a un paciente internado
- **Código SRS:** `RF-44`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** agregar una tarea o conducta pendiente para un paciente internado  
**Para** coordinar acciones clínicas pendientes (pedidos de interconsulta, solicitud de estudios, trámites) con el resto del equipo asistencial.

#### Criterios de Aceptación
- [ ] Debe asociarse al paciente internado seleccionado.
- [ ] **Título:** texto obligatorio, máximo 32 caracteres.
- [ ] **Descripción:** campo de texto libre obligatorio con el detalle de la acción a cumplimentar.
- [ ] El sistema registra de forma automática la fecha y hora de carga.
- [ ] El pendiente se crea inicialmente en estado **"No realizado"** (sin fecha de resolución).

---

### HU-33: Listar, ordenar y filtrar pendientes de un paciente
- **Código SRS:** `RF-45`, `RF-45.1`, `RF-45.2`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** consultar los pendientes de un paciente diferenciando tareas resueltas de las no resueltas  
**Para** priorizar las acciones inmediatas en la recorrida de sala y pase de guardia.

#### Criterios de Aceptación
- [ ] **Visualización:** Muestra los pendientes con:
  - Título.
  - Descripción.
  - Fecha de carga.
  - Fecha de resolución (si ya fue completado).
- [ ] **Ordenamiento (RF-45.1):** Permite ordenar cronológicamente por fecha de carga de la más reciente a la más antigua o viceversa.
- [ ] **Filtros combinables (RF-45.2):**
  - **Estado:**
    - `Realizados`: pendientes que poseen fecha de resolución.
    - `No realizados`: pendientes sin fecha de resolución.
    - `Todos`.
  - **Fecha:** pendientes con fecha de carga comprendida dentro del período de fechas indicado (desde / hasta).
- [ ] Resalta visualmente las tareas pendientes no realizadas para facilitar su identificación inmediata.

---

### HU-34: Registrar realización de un pendiente
- **Código SRS:** `RF-46`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** marcar una tarea pendiente como completada  
**Para** registrar que la conducta médica fue resuelta y archivarla con la fecha en que se cumplió.

#### Criterios de Aceptación
- [ ] Permite seleccionar un pendiente en estado "No realizado" y marcarlo como completado.
- [ ] El estado del pendiente cambia automáticamente a **"Realizado"**.
- [ ] El sistema asigna de forma automática la **fecha actual** como fecha de resolución.
- [ ] No permite volver a marcar como realizado un pendiente que ya cuente con fecha de resolución.
