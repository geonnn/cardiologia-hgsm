# Épica: Catálogo: Tipos de Estudio (`EPIC-CAT-TIPOS-ESTUDIO`)

## Descripción general
Esta épica abarca la gestión integral del nomenclador de tipos de estudios diagnósticos complementarios del Servicio de Cardiología (ej: Electrocardiograma, Ecocardiograma Doppler Transtorácico, Cinecoronariografía, Ergometría, Holter 24hs, Laboratorio General, etc.). Garantiza la unicidad de las categorías, la búsqueda por texto y la protección de borrado si existen estudios médicos asociados a un tipo.

---

## Historias de Usuario

### HU-47: Crear tipo de estudio
- **Código SRS:** `RF-31`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** dar de alta una nueva categoría o tipo de estudio complementario  
**Para** clasificar adecuadamente las prácticas diagnósticas que se indican y realizan a los pacientes.

#### Criterios de Aceptación
- [ ] Debe solicitar:
  - **Nombre:** texto obligatorio, máximo 100 caracteres.
- [ ] Valida que el nombre del tipo de estudio sea único en el catálogo.
- [ ] Si se ingresa un tipo ya existente, rechaza el alta e informa la duplicidad.

---

### HU-48: Listar y buscar tipos de estudios
- **Código SRS:** `RF-32`, `RF-32.1`
- **Rol:** Usuario del sistema

#### Descripción
**Como** usuario del sistema  
**Quiero** consultar y buscar tipos de estudio ordenados alfabéticamente  
**Para** conocer las categorías disponibles y localizar rápidamente el tipo de práctica requerido.

#### Criterios de Aceptación
- [ ] Muestra la lista completa de tipos de estudios cargados.
- [ ] Los resultados se presentan por defecto ordenados **alfabéticamente**.
- [ ] **Búsqueda (RF-32.1):** Permite ingresar texto para filtrar aquellos tipos cuyo nombre coincida con el término ingresado.
- [ ] Si no se hallan coincidencias, muestra un mensaje descriptivo.

---

### HU-49: Modificar tipo de estudio
- **Código SRS:** `RF-33`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** modificar la denominación de un tipo de estudio  
**Para** corregir su descripción o estandarizar la denominación con las prácticas del hospital.

#### Criterios de Aceptación
- [ ] Permite editar el campo:
  - **Nombre:** texto obligatorio, máximo 100 caracteres.
- [ ] Valida que el nombre actualizado siga siendo único en el catálogo.
- [ ] Al guardar, el cambio se refleja inmediatamente en los selectores de estudios del sistema.

---

### HU-50: Eliminar tipo de estudio
- **Código SRS:** `RF-34`
- **Rol:** Usuario Administrador / Servicio

#### Descripción
**Como** usuario del sistema  
**Quiero** eliminar un tipo de estudio que ya no se utilice  
**Para** depurar el catálogo de prácticas diagnósticas obsoletas o cargadas por error.

#### Criterios de Aceptación
- [ ] Permite seleccionar un tipo de estudio y solicitar su eliminación.
- [ ] **Restricción de integridad referencial:** El sistema debe verificar que el tipo de estudio **no se encuentre asociado a ningún estudio médico** cargado en ningún paciente.
- [ ] Si existen estudios de pacientes que utilicen este tipo, el sistema debe impedir la eliminación y mostrar una advertencia clara.
- [ ] Si no está asociado a ningún estudio, solicita confirmación y procede a su eliminación definitiva.
