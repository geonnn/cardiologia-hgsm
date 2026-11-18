# Épica: Estudios Complementarios (`EPIC-ESTUDIOS`)

## Descripción general
Esta épica abarca el registro, consulta y administración de todos los estudios diagnósticos complementarios realizados al paciente (ecocardiogramas, electrocardiogramas, cinecoronariografías, análisis de laboratorio, ergometrías, etc.). Incluye la vinculación con el tipo de estudio catalogado, el informe descriptivo y el filtrado por categoría diagnóstica y fecha.

---

## Historias de Usuario

### HU-29: Agregar estudio complementario a un paciente
- **Código SRS:** `RF-35`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** registrar un nuevo estudio médico complementario para un paciente  
**Para** documentar los hallazgos diagnósticos y conclusiones de los exámenes practicados.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Fecha de estudio:** formato `día/mes/año`, obligatoria. No debe ser posterior a la fecha actual.
  - **Tipo de estudio:** obligatorio, seleccionable desde el catálogo de tipos de estudio precargados.
  - **Título de estudio:** texto obligatorio, máximo 100 caracteres.
  - **Descripción:** campo de texto libre obligatorio para el informe detallado del resultado o conclusión del estudio.
- [ ] El estudio queda vinculado al paciente correspondiente.

---

### HU-30: Listar y filtrar estudios complementarios de un paciente
- **Código SRS:** `RF-37`, `RF-37.1`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** consultar los estudios médicos complementarios de un paciente con filtros por tipo y fecha  
**Para** revisar rápidamente exámenes específicos (por ejemplo, ecocardiogramas o cateterismos) y su cronología.

#### Criterios de Aceptación
- [ ] Muestra la lista de estudios del paciente incluyendo:
  - Fecha del estudio.
  - Tipo de estudio.
  - Título.
  - Descripción / Informe.
- [ ] **Ordenamiento:** Se listan automáticamente por fecha de estudio, de la más reciente a la más antigua.
- [ ] **Filtros combinables (RF-37.1):**
  - **Por Tipo de estudio:** permite filtrar seleccionando uno de los tipos de estudio existentes.
  - **Por Fecha:** permite acotar a un período de fechas determinado (desde / hasta).
- [ ] Si no existen estudios que cumplan los criterios seleccionados, se informa con un mensaje adecuado.

---

### HU-31: Eliminar estudio complementario de un paciente
- **Código SRS:** `RF-36`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** eliminar un estudio complementario cargado erróneamente en la ficha del paciente  
**Para** mantener la exactitud de los informes médicos y descartar registros equivocados.

#### Criterios de Aceptación
- [ ] Permite seleccionar un estudio cargado en el paciente y solicitar su eliminación.
- [ ] Debe requerir confirmación explícita del usuario antes de proceder a la baja.
- [ ] Al confirmarse, el estudio se elimina y deja de figurar en la lista del paciente.
