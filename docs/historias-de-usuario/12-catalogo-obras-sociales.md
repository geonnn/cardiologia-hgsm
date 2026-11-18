# Épica: Catálogo: Obras Sociales (`EPIC-CAT-OBRAS-SOCIALES`)

## Descripción general
Esta épica comprende la gestión completa de las Obras Sociales, Prepagas y coberturas de salud de los pacientes (ej: PAMI, IOMA, OSDE, Swiss Medical, Ninguna/Público, etc.). Permite la creación, edición, consulta alfabética, búsqueda y control de integridad referencial para evitar la eliminación de obras sociales con internaciones registradas.

---

## Historias de Usuario

### HU-43: Crear obra social
- **Código SRS:** `RF-20`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** registrar una nueva obra social o cobertura médica en el catálogo  
**Para** que esté disponible al momento de ingresar la internación de un paciente.

#### Criterios de Aceptación
- [ ] Debe solicitar:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nombre de la obra social sea único en el sistema.
- [ ] Si ya existe una obra social con ese nombre, no permite el registro y muestra un aviso de duplicidad.

---

### HU-44: Listar y buscar obras sociales
- **Código SRS:** `RF-21`, `RF-21.1`
- **Rol:** Usuario del sistema

#### Descripción
**Como** usuario del sistema  
**Quiero** consultar y buscar en la lista de obras sociales disponibles en orden alfabético  
**Para** verificar si una cobertura médica ya está registrada en el sistema.

#### Criterios de Aceptación
- [ ] Muestra el listado de todas las obras sociales registradas con su nombre.
- [ ] Los resultados se muestran ordenados alfabéticamente por defecto.
- [ ] **Búsqueda (RF-21.1):** Permite ingresar texto para buscar obras sociales cuyo nombre coincida con la consulta.
- [ ] Si la búsqueda no arroja resultados, muestra un mensaje descriptivo.

---

### HU-45: Modificar obra social
- **Código SRS:** `RF-22`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** actualizar el nombre de una obra social existente  
**Para** corregir errores en su denominación o actualizar su razón social.

#### Criterios de Aceptación
- [ ] Permite modificar el campo:
  - **Nombre:** texto obligatorio, máximo 30 caracteres.
- [ ] Valida que el nombre modificado sea único entre todas las obras sociales.
- [ ] Al guardar, el cambio se refleja en las vistas y formularios del sistema.

---

### HU-46: Eliminar obra social
- **Código SRS:** `RF-23`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** dar de baja una obra social que fue cargada por error  
**Para** mantener actualizado el nomenclador de coberturas.

#### Criterios de Aceptación
- [ ] Permite seleccionar una obra social y solicitar su eliminación.
- [ ] **Restricción de integridad referencial:** El sistema debe validar que la obra social **no se encuentre asociada a ninguna internación** (vigente o histórica).
- [ ] Si tiene internaciones vinculadas, bloquea la acción notificando que no se puede eliminar una cobertura con registros clínicos asociados.
- [ ] Si no tiene internaciones vinculadas, solicita confirmación explícita y la elimina del sistema.
