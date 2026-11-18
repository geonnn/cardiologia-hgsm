# Épica: Padrón de Pacientes (`EPIC-PACIENTES`)

## Descripción general
Esta épica abarca el registro maestro y administración de los pacientes del Servicio de Cardiología. Incluye el alta y modificación de la ficha personal (datos filiatorios, hasta 5 contactos de emergencia, médico de cabecera, antecedentes clínicos y factores de riesgo cardiovascular), así como la visualización tabular completa con capacidades avanzadas de ordenamiento, filtros clínicos/temporales y búsqueda combinada.

---

## Historias de Usuario

### HU-16: Registrar nuevo paciente
- **Código SRS:** `RF-24`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** ingresar un nuevo paciente al padrón con sus datos personales, contactos y antecedentes  
**Para** contar con su ficha clínica centralizada en el sistema antes de iniciar una internación o consulta.

#### Criterios de Aceptación
- [ ] **Datos obligatorios:**
  - **Nombre:** texto, máximo 50 caracteres.
  - **Apellido:** texto, máximo 50 caracteres.
  - **Sexo:** seleccionable entre `M` o `F`.
  - **DNI:** 7 a 9 caracteres alfanuméricos. Debe ser único en el sistema.
  - **Fecha de nacimiento:** formato `día/mes/año`, obligatoria, no debe ser posterior a la fecha actual. El sistema calcula la edad automáticamente.
- [ ] **Datos opcionales:**
  - **Médico de cabecera:** opcional (0 o 1), seleccionable del listado/catálogo de médicos de cabecera registrados.
  - **Contactos del paciente:** opcional, permite registrar de 1 hasta un máximo de 5 contactos. Por cada contacto:
    - Nombre: obligatorio (del contacto), máximo 50 caracteres.
    - Apellido: opcional, máximo 50 caracteres.
    - Número de teléfono: obligatorio (del contacto), numérico de hasta 15 dígitos.
    - Parentesco: opcional (del contacto), texto, máximo 15 caracteres.
  - **Antecedentes:** campo de texto libre, opcional.
  - **Factores de riesgo cardiovascular (FRCV):** selección múltiple desde el catálogo de FRCV precargado, opcional.
- [ ] Si se ingresa un DNI ya existente en el sistema, debe rechazar el alta notificando la colisión.
- [ ] Registra automáticamente la fecha y hora de carga.

---

### HU-17: Modificar datos del paciente
- **Código SRS:** `RF-25`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** editar los datos personales, antecedentes o contactos de un paciente existente  
**Para** mantener actualizada y corregida su información filiatoria y clínica básica.

#### Criterios de Aceptación
- [ ] Permite editar todos los campos definidos en el alta: Nombre (máx 50), Apellido (máx 50), Sexo (`M`/`F`), DNI (7-9 caracteres alfanuméricos), Fecha de nacimiento (no posterior a hoy), Antecedentes (opcional), Médico de cabecera (opcional, 0 o 1 seleccionable del listado/catálogo), Contactos (hasta 5 con sus subcampos, siendo obligatorios Nombre y Teléfono, y opcionales Apellido y Parentesco) y FRCV asociados.
- [ ] Si se modifica el DNI, valida nuevamente que el nuevo valor sea único entre todos los pacientes registrados.
- [ ] Mantiene la integridad de los contactos (no permite agregar más de 5 ni dejar campos obligatorios del contacto vacíos: Nombre y Teléfono).
- [ ] Guarda los cambios y actualiza la vista de inmediato.

---

### HU-18: Listar, ordenar, filtrar y buscar pacientes
- **Código SRS:** `RF-26`, `RF-26.1`, `RF-26.2`, `RF-26.3`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** consultar el padrón de pacientes con opciones de búsqueda, ordenamiento múltiple y filtros clínicos  
**Para** localizar rápidamente la ficha de un paciente internado o histórico.

#### Criterios de Aceptación
- [ ] **Visualización básica:** Muestra una tabla con los siguientes datos por paciente:
  - Nombre y Apellido
  - Sexo (`M`/`F`)
  - DNI
  - Edad calculada
  - Fecha de registro/carga
- [ ] **Ordenamiento (RF-26.1):** Permite ordenar por:
  - Alfabéticamente por apellido y nombre (ascendente y descendente).
  - Cronológicamente por fecha de carga (más reciente a más antigua y viceversa).
  - Por edad (de menor a mayor y viceversa).
- [ ] **Filtros (RF-26.2):** Permite filtrar de forma combinable por:
  - **Motivo de internación:** muestra pacientes que tengan al menos una internación registrada con el motivo seleccionado.
  - **Factor de riesgo cardiovascular:** muestra pacientes que tengan asociado el FRCV seleccionado.
  - **Período de fechas:** muestra pacientes cuya fecha de carga se encuentre en el rango indicado.
- [ ] **Búsqueda combinada (RF-26.3):**
  - Permite buscar por DNI, Nombre y/o Apellido (soporta combinaciones simultáneas).
  - Devuelve los pacientes coincidentes con los términos buscados.
- [ ] Si no hay coincidencias, informa que no se encontraron pacientes con los filtros aplicados.
