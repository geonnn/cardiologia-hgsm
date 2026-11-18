# Épica: Catálogo: Motivos de Internación (`EPIC-CAT-MOTIVOS`)

## Descripción general
Esta épica comprende la gestión completa (CRUD) de la tabla maestra de Motivos de Internación (patologías diagnósticas principales de ingreso, ej: Insuficiencia Cardíaca Descompensada, Síndrome Coronario Agudo, Arritmia Ventricular, etc.). Incluye la unicidad del nombre, búsqueda alfabética y la validación de integridad referencial para impedir el borrado de motivos vinculados a internaciones.

---

## Historias de Usuario

### HU-35: Crear motivo de internación
- **Código SRS:** `RF-12`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** dar de alta un nuevo motivo de internación  
**Para** ampliar el catálogo de causas clínicas de ingreso disponibles en el servicio.

#### Criterios de Aceptación
- [ ] Debe solicitar:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nombre no esté duplicado en la base de datos (debe ser único).
- [ ] Si se intenta ingresar un nombre existente, rechaza el alta e informa el motivo.

---

### HU-36: Listar y buscar motivos de internación
- **Código SRS:** `RF-13`, `RF-13.1`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** visualizar y buscar en la lista de motivos de internación ordenados alfabéticamente  
**Para** consultar los motivos vigentes o seleccionar uno rápidamente por texto.

#### Criterios de Aceptación
- [ ] Muestra el listado de todos los motivos de internación cargados.
- [ ] Los resultados se presentan por defecto ordenados **alfabéticamente**.
- [ ] **Búsqueda (RF-13.1):** Permite ingresar texto y filtra en tiempo real o por confirmación aquellos motivos cuyo nombre coincida con el término ingresado.
- [ ] Si no hay coincidencias con la búsqueda, muestra un mensaje indicando que no se encontraron resultados.

---

### HU-37: Modificar motivo de internación
- **Código SRS:** `RF-14`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** modificar la denominación de un motivo de internación  
**Para** corregir errores ortográficos o ajustar la nomenclatura médica.

#### Criterios de Aceptación
- [ ] Permite editar el campo:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nuevo nombre siga siendo único entre todos los motivos registrados.
- [ ] Al guardar, el cambio se refleja en todas las vistas del catálogo.

---

### HU-38: Eliminar motivo de internación
- **Código SRS:** `RF-15`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** eliminar un motivo de internación en desuso  
**Para** depurar el catálogo de opciones obsoletas o erróneas.

#### Criterios de Aceptación
- [ ] Permite seleccionar un motivo y solicitar su eliminación.
- [ ] **Restricción de integridad referencial:** El sistema debe verificar que el motivo de internación **no esté asociado a ninguna internación** (activa o histórica).
- [ ] Si el motivo está vinculado a al menos una internación, la eliminación debe ser **bloqueada** con un mensaje explicativo.
- [ ] Si no tiene internaciones asociadas, solicita confirmación y procede a la eliminación definitiva.
