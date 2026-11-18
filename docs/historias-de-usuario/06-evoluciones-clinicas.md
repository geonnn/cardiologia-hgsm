# Épica: Evoluciones Clínicas (`EPIC-EVOLUCIONES`)

## Descripción general
Esta épica abarca el seguimiento médico diario del paciente internado mediante el registro cronológico de notas de evolución clínica, su visualización ordenada y la posibilidad de filtrar notas por rango de fechas para evaluar la respuesta a las conductas terapéuticas adoptadas.

---

## Historias de Usuario

### HU-23: Registrar nota de evolución de paciente internado
- **Código SRS:** `RF-38`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** registrar una nota de evolución médica para un paciente internado  
**Para** documentar cronológicamente su estado clínico diario, novedades del pase de sala y respuesta terapéutica.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Fecha de evolución:** formato `día/mes/año`, obligatoria. No debe ser posterior a la fecha actual.
  - **Descripción:** campo de texto libre, obligatorio.
- [ ] La nota se asocia de forma unívoca al paciente y a su internación actual.
- [ ] Se valida que la descripción no esté vacía ni compuesta exclusivamente por espacios.

---

### HU-24: Listar, ordenar y filtrar notas de evolución
- **Código SRS:** `RF-39`, `RF-39.1`, `RF-39.2`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** visualizar las notas de evolución de un paciente con ordenamiento cronológico y filtros por fecha  
**Para** revisar el curso temporal de la internación y consultar registros de días específicos.

#### Criterios de Aceptación
- [ ] **Visualización:** Muestra el listado de evoluciones con:
  - Fecha de la evolución.
  - Descripción de la nota.
- [ ] **Ordenamiento por defecto:** Por defecto se presentan ordenadas cronológicamente de la más reciente a la más antigua.
- [ ] **Ordenamiento configurable (RF-39.1):** Permite invertir el orden para visualizar de la más antigua a la más reciente o viceversa.
- [ ] **Filtrado temporal (RF-39.2):** Permite filtrar por rango de fechas (desde / hasta), mostrando únicamente las evoluciones comprendidas en dicho intervalo.
- [ ] Si el paciente no posee evoluciones registradas o ninguna cumple el filtro, se muestra un mensaje informativo.
