# Épica: Tratamientos e Indicaciones (`EPIC-TRATAMIENTOS`)

## Descripción general
Esta épica comprende la prescripción y registro de las indicaciones médicas y esquemas farmacológicos de los pacientes internados en el Servicio de Cardiología. Incluye el alta de indicaciones, el historial con orden y filtros de fechas, la rectificación controlada del último tratamiento prescripto y la eliminación de esquemas.

---

## Historias de Usuario

### HU-25: Registrar nuevo tratamiento para paciente internado
- **Código SRS:** `RF-40`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** registrar una indicación o esquema de tratamiento para un paciente internado  
**Para** documentar la terapéutica farmacológica, dosis y medidas activas indicadas por el equipo médico.

#### Criterios de Aceptación
- [ ] Debe asociarse obligatoriamente a un paciente internado.
- [ ] **Descripción:** campo de texto obligatorio con el detalle del esquema de tratamiento e indicaciones.
- [ ] **Fecha y hora:** por defecto se carga con la fecha y hora actual.
- [ ] **Validación de rango de fecha:** el sistema no admite fechas que se encuentren a más de 2 meses anteriores o posteriores a la fecha actual.
- [ ] Al registrarse, el nuevo tratamiento pasa a ser la indicación vigente más reciente del paciente.

---

### HU-26: Listar, ordenar y filtrar tratamientos de un paciente
- **Código SRS:** `RF-41`, `RF-41.1`, `RF-41.2`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** consultar el historial de tratamientos e indicaciones del paciente con ordenamiento y filtros  
**Para** evaluar las modificaciones farmacológicas realizadas a lo largo de la internación.

#### Criterios de Aceptación
- [ ] Muestra la lista de tratamientos con:
  - Descripción de las indicaciones.
  - Fecha y hora del tratamiento.
- [ ] **Ordenamiento (RF-41.1):** Permite ordenar por fecha de carga de la más reciente a la más antigua o viceversa.
- [ ] **Filtrado (RF-41.2):** Permite filtrar por rango de fechas (desde / hasta), mostrando los tratamientos comprendidos en dicho período.
- [ ] Destaca visualmente cuál es la indicación más reciente (tratamiento activo).

---

### HU-27: Modificar último tratamiento de un paciente internado
- **Código SRS:** `RF-42`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** editar únicamente el último tratamiento cargado del paciente internado  
**Para** corregir errores de tipeo, ajustar una dosis o actualizar la indicación sin alterar tratamientos históricos previos.

#### Criterios de Aceptación
- [ ] Solo se permite la modificación sobre el **último tratamiento registrado** del paciente internado. Los tratamientos anteriores no son editables (se preserva la trazabilidad histórica).
- [ ] Permite modificar:
  - **Descripción:** texto obligatorio.
  - **Fecha y hora:** opcional; si se modifica, no admite fechas de más de 2 meses anteriores o posteriores a la actual.
- [ ] Al guardar los cambios, se actualiza la descripción y/o fecha de la última indicación médica.

---

### HU-28: Eliminar tratamiento de un paciente internado
- **Código SRS:** `RF-43`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** eliminar un tratamiento cargado por error en un paciente internado  
**Para** mantener el registro de indicaciones limpio de cargas erróneas o duplicadas.

#### Criterios de Aceptación
- [ ] Permite seleccionar un tratamiento del listado del paciente y solicitar su baja.
- [ ] Debe solicitar confirmación previa del usuario antes de proceder.
- [ ] Una vez eliminado, deja de visualizarse en el historial de tratamientos del paciente.
