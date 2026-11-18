# Épica: Ciclo de Internación (`EPIC-INTERNACION`)

## Descripción general
Esta épica modela el flujo integral del episodio de internación del paciente en el Servicio de Cardiología: la admisión hospitalaria (asignación de cama, tipo de tratamiento, aislamiento y diagnóstico inicial), la modificación o pase de cama (incluyendo reasignación o swap entre pacientes), la consulta histórica de internaciones del paciente, y el cierre de internación / egreso hospitalario (alta, óbito, traslado o retiro voluntario) con liberación automática de la cama física.

---

## Historias de Usuario

### HU-19: Crear internación de un paciente
- **Código SRS:** `RF-47`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** ingresar la internación de un paciente asignándole cama, motivo, tipo de tratamiento y datos clínicos iniciales  
**Para** dar inicio al seguimiento médico asistencial activo en el servicio.

#### Criterios de Aceptación
- [ ] **Validación previa:** El paciente seleccionado no debe tener una internación en curso activa (sin fecha de egreso).
- [ ] **Campos requeridos:**
  - **Paciente:** seleccionable desde el padrón de pacientes registrados.
  - **Fecha de ingreso:** formato `día/mes/año`, no debe ser posterior a la fecha actual. Por defecto toma la fecha actual.
  - **Cama:** seleccionable únicamente de la lista de camas en estado `"Disponible"`. Al confirmarse el ingreso, la cama pasa a estado `"Ocupada"`.
  - **Tipo de tratamiento:** seleccionable entre `UCO` o `Sala`. Por defecto toma el sector de la cama elegida, pero puede cambiarse independientemente.
  - **Motivos de internación:** selección múltiple del catálogo de motivos; debe seleccionarse al menos uno obligatoriamente.
- [ ] **Campos opcionales:**
  - **Obra social:** opcional (0 o 1), seleccionable del catálogo de obras sociales.
  - **Aislamiento:** descripción de la precaución médica, texto de hasta 50 caracteres.
  - **Cama a bloquear por aislamiento:** seleccionable de la lista de camas disponibles. Si se indica, dicha cama pasa a estado `"En aislamiento"` (ver RF-27).
  - **Parámetros / Antropometría:** texto libre (superficie corporal, peso, altura, etc.).
  - **Tratamiento previo:** texto libre descriptivo.
  - **Tratamiento actual:** opcionalmente permite ingresar la primera indicación médica farmacológica al momento del ingreso (vinculada a RF-40).
  - **Observaciones:** texto libre.

---

### HU-20: Modificar internación activa y pase de cama
- **Código SRS:** `RF-49`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** editar los datos de una internación en curso o cambiar/intercambiar la cama asignada al paciente  
**Para** reflejar la evolución clínica, el traslado entre sectores o rectificar información de ingreso.

#### Criterios de Aceptación
- [ ] Solo permite modificar internaciones que no posean fecha de fin registrada (internaciones activas).
- [ ] **Modificación de Cama (Pase / Swap):**
  - Si la cama de destino está en estado `"Disponible"`: el sistema reasigna la cama al paciente, la cama de origen queda en estado `"Disponible"` y la cama de destino pasa a `"Ocupada"`.
  - Si la cama de destino se encuentra en estado `"Ocupada"`: el sistema realiza un **intercambio automático de camas (swap)** entre ambos pacientes internados, manteniendo a cada uno con su respectivo tratamiento y datos.
- [ ] **Otros campos editables:**
  - Fecha de ingreso (no posterior a hoy).
  - Motivo(s) de internación (al menos uno).
  - Obra social (opcional, 0 o 1).
  - Tipo de tratamiento (`UCO` o `Sala`).
  - Aislamiento (máx 50 caracteres) y cama a bloquear por aislamiento.
  - Parámetros / Antropometría.
  - Tratamiento previo.
  - Observaciones.

---

### HU-21: Listar historial de internaciones de un paciente
- **Código SRS:** `RF-48`, `RF-48.1`, `RF-48.2`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** consultar el historial de internaciones de un paciente con ordenamiento cronológico y filtros  
**Para** analizar sus ingresos previos y antecedentes en el servicio.

#### Criterios de Aceptación
- [ ] Muestra el listado de internaciones del paciente con:
  - Fecha de ingreso.
  - Motivos de internación registrados.
  - Fecha de egreso (si ya finalizó).
  - Condición de alta (si ya finalizó).
- [ ] **Ordenamiento (RF-48.1):** Permite ordenar por fecha de ingreso, de la más reciente a la más antigua o viceversa.
- [ ] **Filtrado (RF-48.2):** Permite filtrar por rango de fechas (fecha desde / hasta de ingreso).

---

### HU-22: Registrar fin de internación y alta
- **Código SRS:** `RF-50`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** registrar el egreso o fin de internación de un paciente con su condición de alta  
**Para** cerrar el episodio asistencial y liberar inmediatamente la cama física para otros pacientes.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Condición de alta:** obligatoria, seleccionable exclusivamente entre:
    1. `"Alta hospitalaria"`
    2. `"Óbito"`
    3. `"Traslado"`
    4. `"Retiro voluntario"`
  - **Fecha de egreso:** formato `día/mes/año`, obligatoria.
- [ ] **Validaciones de fecha:**
  - La fecha de egreso no debe ser posterior a la fecha actual.
  - La fecha de egreso no debe ser anterior a la fecha de ingreso de dicha internación.
- [ ] **Liberación de cama:** Al confirmar el fin de internación, la cama asignada al paciente pasa de forma automática al estado **"Disponible"**.
- [ ] La internación queda marcada como finalizada y ya no podrá ser modificada como internación activa.
