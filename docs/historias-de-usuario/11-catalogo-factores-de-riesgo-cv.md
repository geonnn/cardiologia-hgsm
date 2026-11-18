# Épica: Catálogo: Factores de Riesgo Cardiovascular (`EPIC-CAT-FRCV`)

## Descripción general
Esta épica abarca el mantenimiento y administración del catálogo de Factores de Riesgo Cardiovascular (FRCV) (ej: Hipertensión Arterial, Diabetes Mellitus, Tabaquismo, Dislipidemia, Obesidad, Sedentarismo, etc.), utilizados para la estratificación del riesgo del paciente en su ficha de padrón. Garantiza nombres únicos, búsqueda rápida y protección contra borrados accidentales de factores en uso.

---

## Historias de Usuario

### HU-39: Crear factor de riesgo cardiovascular
- **Código SRS:** `RF-16`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** ingresar un nuevo factor de riesgo cardiovascular en el catálogo  
**Para** permitir su selección en las fichas clínicas de los pacientes.

#### Criterios de Aceptación
- [ ] Debe solicitar:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nombre sea único en el catálogo (no sensible a mayúsculas/minúsculas).
- [ ] En caso de duplicidad, rechaza el registro e informa al usuario.

---

### HU-40: Listar y buscar factores de riesgo cardiovascular
- **Código SRS:** `RF-17`, `RF-17.1`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** consultar y buscar factores de riesgo cardiovascular en orden alfabético  
**Para** revisar los factores existentes y comprobar su disponibilidad para la carga clínica.

#### Criterios de Aceptación
- [ ] Muestra el listado de todos los factores de riesgo registrados.
- [ ] Los resultados se presentan por defecto en orden **alfabético**.
- [ ] **Búsqueda (RF-17.1):** Permite ingresar un texto de búsqueda para filtrar al instante los factores cuyo nombre coincida con el criterio.
- [ ] Si la búsqueda no arroja coincidencias, muestra un mensaje descriptivo.

---

### HU-41: Modificar factor de riesgo cardiovascular
- **Código SRS:** `RF-18`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** editar el nombre de un factor de riesgo cardiovascular  
**Para** enmendar errores ortográficos o unificar criterios terminológicos médicos.

#### Criterios de Aceptación
- [ ] Permite modificar el campo:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nuevo nombre no coincida con otro factor existente.
- [ ] Al guardar, el cambio se refleja en todo el sistema.

---

### HU-42: Eliminar factor de riesgo cardiovascular
- **Código SRS:** `RF-19`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** eliminar un factor de riesgo cardiovascular que ya no sea aplicable  
**Para** mantener limpio el catálogo de opciones de estratificación clínica.

#### Criterios de Aceptación
- [ ] Permite seleccionar un factor de riesgo y solicitar su baja.
- [ ] **Restricción de integridad referencial:** El sistema debe comprobar que el factor de riesgo **no esté asignado a ningún paciente** en el padrón.
- [ ] Si el factor está en uso por al menos un paciente, la eliminación se rechaza notificando la restricción de integridad.
- [ ] Si no está asociado a ningún paciente, solicita confirmación y procede a su eliminación definitiva.
