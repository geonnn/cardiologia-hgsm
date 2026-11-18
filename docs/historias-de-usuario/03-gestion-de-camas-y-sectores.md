# Épica: Gestión de Camas y Sectores (`EPIC-CAMAS`)

## Descripción general
Esta épica comprende la administración y visualización del censo de camas físicas del Servicio de Cardiología distribuidas entre la Unidad Coronaria (UCO) y Sala. Controla los estados operativos de las camas (Disponible, Ocupada, En aislamiento, Deshabilitada), el bloqueo preventivo por aislamiento, y la visualización en tiempo real de la ocupación hospitalaria.

---

## Historias de Usuario

### HU-10: Crear cama
- **Código SRS:** `RF-10`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** dar de alta una nueva cama indicando su sector y numeración  
**Para** ampliar la capacidad instalada y ponerla a disposición para futuras internaciones.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Número de cama:** obligatorio, número entero positivo estrictamente mayor a 0.
  - **Sector al que pertenece:** obligatorio, seleccionable entre `UCO` o `Sala`.
- [ ] Valida que el número de cama sea único dentro del mismo sector (no puede haber dos camas con el mismo número en Sala o dos en UCO).
- [ ] La cama se crea automáticamente con el estado inicial **"Disponible"**.

---

### HU-11: Listar y filtrar censo de camas
- **Código SRS:** `RF-11`, `RF-11.1`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** visualizar el censo completo de camas con su estado y datos del paciente ocupante, con filtros por sector y estado  
**Para** conocer de un vistazo la ocupación de la sala/UCO y gestionar la disponibilidad asistencial.

#### Criterios de Aceptación
- [ ] **Información mostrada por cada cama:**
  - Número de cama.
  - Sector al que pertenece (`UCO` o `Sala`).
  - Estado actual (`Disponible`, `Ocupada`, `En aislamiento`, `Deshabilitada`).
  - **Si la cama está ocupada**, debe mostrar adicionalmente:
    - Nombre y apellido del paciente internado.
    - Edad del paciente.
    - Sexo del paciente (`M` o `F`).
    - Motivo de internación registrado.
    - Cantidad de días transcurridos desde el inicio de la internación actual.
- [ ] **Filtros combinables (RF-11.1):**
  - **Por Sector:** permite filtrar por `UCO`, `Sala` o todos.
  - **Por Estado:** permite filtrar por `Disponible`, `Ocupada`, `En aislamiento`, `Deshabilitada` o todos.
  - Permite la aplicación conjunta y simultánea de ambos filtros (ej: "Camas en UCO que estén Disponibles").

---

### HU-12: Bloquear cama por aislamiento
- **Código SRS:** `RF-27`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** bloquear una cama disponible por motivos de aislamiento infectológico  
**Para** reservar el espacio y evitar que sea asignada a otro paciente mientras rija la precaución médica.

#### Criterios de Aceptación
- [ ] Solo se puede aplicar la acción sobre camas que se encuentren en estado **"Disponible"**.
- [ ] Al confirmarse el bloqueo, el estado de la cama pasa inmediatamente a **"En aislamiento"**.
- [ ] Una cama en estado "En aislamiento" queda inhabilitada para ser seleccionada en nuevas internaciones.

---

### HU-13: Desbloquear cama en aislamiento
- **Código SRS:** `RF-28`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** desbloquear una cama que estaba en aislamiento  
**Para** devolverla al circuito operativo una vez finalizadas las medidas de aislamiento e higiene.

#### Criterios de Aceptación
- [ ] Solo se puede ejecutar sobre camas en estado **"En aislamiento"**.
- [ ] Al confirmarse la acción, el estado de la cama cambia a **"Disponible"**.
- [ ] La cama vuelve a figurar como apta y seleccionable para nuevas internaciones.

---

### HU-14: Deshabilitar cama
- **Código SRS:** `RF-29`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** deshabilitar una cama que no está en condiciones de uso (por mantenimiento, desperfecto o desinfección)  
**Para** retirarla temporalmente de la disponibilidad asistencial.

#### Criterios de Aceptación
- [ ] Solo se puede deshabilitar una cama que esté actualmente en estado **"Disponible"**.
- [ ] Al confirmarse, el estado de la cama cambia de "Disponible" a **"Deshabilitada"**.
- [ ] La cama deshabilitada no podrá ser seleccionada para próximas internaciones mientras conserve este estado.

---

### HU-15: Habilitar cama deshabilitada
- **Código SRS:** `RF-30`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** habilitar una cama que se encontraba deshabilitada  
**Para** reincorporarla al censo activo cuando se encuentre nuevamente operativa.

#### Criterios de Aceptación
- [ ] Solo se puede ejecutar sobre camas en estado **"Deshabilitada"**.
- [ ] Al confirmarse la habilitación, el estado de la cama cambia a **"Disponible"**.
- [ ] Queda disponible de inmediato para nuevas internaciones.
