# Especificación de Requisitos de Software (SRS)

**Proyecto:** Servicio de Cardiología - Hospital General San Martín

## 1) Introducción

### ● Propósito y alcance

El propósito de este documento es especificar los requisitos del software, tanto funcionales como no funcionales, para el sistema del Servicio de Cardiología del Hospital General San Martín.

Está dirigido al personal del Servicio de Cardiología del Hospital General San Martín y a los desarrolladores del sistema. Este documento es fundamental para coordinar la planificación, diseño e implementación del sistema.

### ● Definiciones, acrónimos y abreviaturas a considerar

- **Software:** Programas y aplicaciones que se ejecutan en un sistema informático, computadora o dispositivo electrónico.
- **Hardware:** Los elementos físicos que componen un sistema informático, computadora o dispositivo electrónico.
- **SRS:** Documento de Especificación de Requisitos de Software, SRS por sus siglas en inglés, que define las funcionalidades, restricciones y comportamiento del sistema.
- **Requisito funcional:** Especificación de una función o comportamiento que el sistema debe realizar.
- **Requisito no funcional:** Restricciones y/o cualidades del sistema que definen cómo debe funcionar.
- **Internación:** Período comprendido entre el ingreso de un paciente al Servicio de Cardiología y su alta o defunción.
- **Unidad coronaria (UCO):** Sector del servicio donde se aloja normalmente a los pacientes críticos.
- **Sala:** Sector del servicio donde se aloja normalmente a los pacientes no críticos.
- **Tipo de tratamiento:** Indica si el paciente requiere manejo de sala o de unidad coronaria, de forma independiente de la cama física en la que se encuentra (permite representar a un paciente crítico ubicado en una cama de sala, o viceversa).
- **Evernote:** Aplicación de notas en texto plano que el Servicio de Cardiología utiliza actualmente para registrar a los pacientes internados.
- **Remesi:** Sistema oficial del hospital de historias clínicas de internación, con valor legal.
- **Farhos:** Sistema dedicado al tratamiento medicamentoso, con valor legal por conservar el historial de medicamentos agregados o suspendidos.
- **Datos filiatorios del paciente:** Datos de identificación y contacto del paciente.
- **MI - Motivo de internación:** Título breve, generalmente una patología, que describe la razón del ingreso del paciente.
- **FRCV - Factores de riesgo cardiovasculares:** Condiciones conocidas del paciente que aumentan su riesgo cardiovascular.
- **Antecedentes:** Enfermedades y/o eventos previos del paciente.
- **Aislamiento:** Precaución de contacto que requiere un paciente.
- **Parámetros:** Datos de control del paciente, principalmente el peso diario en kilogramos para el seguimiento del balance de líquidos.
- **Antropometría:** Medidas corporales del paciente: superficie corporal, peso en kilogramos y altura en centímetros.
- **Tratamiento:** Indicaciones o conductas médicas.
- **Estudios:** Estudios médicos realizados al paciente.
- **Evolución:** Registro cronológico de los eventos relevantes ocurridos durante la internación de un paciente.
- **Conducta/Pendientes:** Acciones a resolver con el paciente internado.

### ● Referencias

| Documento | Fecha | Autor |
|---|---|---|
| Minuta entrevista 1 | 16/09/2026 | Equipo de desarrollo |
| Minuta entrevista 2 | 23/09/2026 | Equipo de desarrollo |
| Minuta entrevista 3 | 30/09/2026 | Equipo de desarrollo |

## 2) Descripción general

### a. Resumen de la idea del producto

El sistema consiste en una plataforma de gestión de pacientes para el Servicio de Cardiología del Hospital General San Martín. Permite registrar y consultar la historia clínica de cada paciente internado, durante y luego del período de internación. Permite al personal asociado al Servicio de Cardiología cargar de forma estructurada los datos de cada paciente (datos filiatorios, motivo de internación, antecedentes, estudios complementarios, evolución, tratamiento, entre otros) y realizar búsquedas sobre la información almacenada.

### b. Perspectiva del producto

El sistema es independiente, no forma parte ni depende de un sistema mayor.

### c. Características de los usuarios

El sistema está destinado al uso por el personal perteneciente al Servicio de Cardiología del Hospital General San Martín. Sus capacidades de operación se dividen en dos roles principales:

- **Usuario:** Tiene acceso a las funciones operativas de gestión e historia clínica de los pacientes.
- **Usuario administrador:** Accede a la administración del sistema para dar de alta, modificar, listar y dar de baja cuentas de usuario.

## 3) Requisitos del Software

### Requisitos de Interfaz

#### a. Interfaz de Usuario

El equipo definió una paleta de colores principales tomando como referencia los colores del logo brindado por el servicio de cardiología.

**Logo:**

![Logo servicio de cardiología](./logo-cardiologia.jpeg)

**Paleta de colores:**

| Color | Código |
|---|---|
| Rojo | `#C0392B` |
| Azul oscuro | `#34485D` |
| Blanco | `#FAF8F2` |
| Negro | `#171615` |

**Idioma y formatos:**

- Interfaz en español.
- Fechas en formato día/mes/año.

#### b. Interfaces de Software

El sistema es independiente y no requiere integración con otros productos de software. Remesi, Farhos y Evernote no se conectan con este sistema.

#### c. Interfaces de Hardware

No se requiere hardware específico ni dispositivos especiales.

### Requisitos funcionales

> **NOTA:** Los campos no especificados como opcionales son de ingreso obligatorio.

#### RF-01: Autenticación en panel de administración

El sistema debe permitir iniciar sesión en el panel de administración validando que las credenciales sean correctas antes de permitir acceso al panel. El sistema debe utilizar como mecanismo de autenticación los siguientes datos:

- Correo electrónico: formato correo electrónico (usuario@dominio).
- Contraseña

#### RF-02: Crear usuario

El sistema debe permitir al usuario administrador crear un nuevo usuario con los siguientes datos:

- Nombre: texto, máximo 50 caracteres.
- Apellido: texto, máximo 50 caracteres.
- Correo electrónico: formato correo electrónico (usuario@dominio).
- Contraseña: texto, mínimo 6 caracteres, una minúscula y un número, máximo 12 caracteres.

El correo electrónico debe ser único para cada usuario.

#### RF-03: Iniciar sesión

El sistema debe permitir el acceso a usuarios registrados mediante la validación previa de sus credenciales. Para llevar a cabo el proceso de validación, se solicitarán los siguientes datos:

- Correo electrónico: formato correo electrónico (usuario@dominio).
- Contraseña

#### RF-04: Cerrar sesión

El sistema debe permitir, a usuarios con una sesión activa, finalizar la sesión.

#### RF-05: Modificar datos como usuario

El sistema debe permitir al usuario con una sesión activa, cambiar sus datos de identificación. Los datos modificables son los siguientes:

- Nombre: máximo 50 caracteres.
- Apellido: máximo 50 caracteres.

#### RF-06: Cambiar contraseña

El sistema debe permitir a un usuario con una sesión activa, cambiar su contraseña con los siguientes datos:

- Contraseña actual: contraseña asociada a dicho usuario.
- Contraseña nueva: texto, mínimo 6 caracteres, una minúscula y un número, máximo 12 caracteres.
- Reiteración de la contraseña nueva: texto, mínimo 6 caracteres, una minúscula y un número, máximo 12 caracteres. El valor ingresado debe ser exactamente igual al valor ingresado en el dato contraseña nueva.

#### RF-07: Cambiar contraseña de usuario (administrador)

El sistema debe permitir al usuario administrador cambiar la contraseña de un usuario con los siguientes datos:

- Contraseña nueva: texto, mínimo 6 caracteres, una minúscula y un número, máximo 12 caracteres.
- Reiteración de la contraseña nueva: texto, mínimo 6 caracteres, una minúscula y un número, máximo 12 caracteres. El valor ingresado debe ser exactamente igual al valor ingresado en el dato contraseña nueva.

#### RF-08: Listar usuarios

El sistema debe permitir al administrador listar los usuarios registrados, mostrando los siguientes datos de cada usuario:

- Nombre
- Apellido
- Correo electrónico
- Fecha de carga

##### RF-08.1: Ordenar el listado de usuarios

El sistema debe permitir al administrador ordenar los resultados del listado de usuarios de las siguientes maneras:

- Orden alfabético por apellido y nombre (ascendente y descendente).
- Orden cronológico de la fecha de carga más reciente a la más antigua o viceversa.

##### RF-08.2: Filtrar el listado de usuarios

El sistema debe permitir al administrador filtrar el resultado del listado de usuarios con los siguientes filtros:

- Fecha: se deben mostrar todos los usuarios con fecha de carga comprendida entre un período de fechas indicado.

##### RF-08.3: Buscar en el listado de usuarios

El sistema debe permitir al administrador buscar usuarios mediante el ingreso de criterios para correo electrónico, nombre o apellido y sus posibles combinaciones. Como respuesta, se deberá mostrar un listado de usuarios en los que coincidan los términos especificados para cada campo.

#### RF-09: Eliminar usuario

El sistema debe permitir al usuario administrador eliminar un usuario registrado.

#### RF-10: Crear cama

El sistema debe permitir crear una cama con los siguientes datos:

- Número de cama: número entero, mayor a 0.
- Sector al que pertenece: seleccionable entre UCO o Sala.

El número de cama debe ser único entre camas de un mismo sector. La cama se crea con estado "Disponible".

#### RF-11: Listar camas

El sistema debe permitir listar todas las camas registradas mostrando los siguientes datos:

- Número de cama
- Sector al que pertenece
- Estado
- Datos del paciente que la ocupa, si corresponde, se muestran los siguientes datos:
  - Nombre y apellido
  - Edad
  - Sexo
  - Motivo de internación
  - Cantidad de días que lleva internado

##### RF-11.1: Filtrar listado de camas

El sistema debe permitir filtrar el resultado del listado de camas con los siguientes filtros:

- Sector: se deben mostrar todas las camas asociadas al sector seleccionado (UCO o Sala).
- Estado: se deben mostrar todas las camas con el estado seleccionado. (Disponible, Ocupada, En aislamiento o Deshabilitada).

El sistema permite combinar los distintos filtros.

#### RF-12: Crear motivo de internación

El sistema debe permitir crear un motivo de internación con los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre del motivo de internación debe ser único para cada motivo de internación.

#### RF-13: Listar motivos de internación

El sistema debe permitir listar los motivos de internación, ordenados alfabéticamente, mostrando el nombre del motivo de internación.

##### RF-13.1: Buscar motivo de internación

El sistema debe permitir la búsqueda de motivos de internación ingresando su nombre. Como respuesta se deberá mostrar un listado con aquellos motivos de internación que coincidan con la búsqueda realizada.

#### RF-14: Modificar motivo de internación

El sistema debe permitir modificar los motivos de internación. Se podrán modificar los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre del motivo de internación debe ser único para cada motivo de internación.

#### RF-15: Eliminar motivo de internación

El sistema debe permitir eliminar motivos de internación. El motivo de internación a eliminar no debe estar asociado a una internación para realizar la operación.

#### RF-16: Crear factor de riesgo cardiovascular

El sistema debe permitir crear un factor de riesgo cardiovascular con los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre del factor de riesgo cardiovascular debe ser único para cada factor de riesgo cardiovascular.

#### RF-17: Listar factores de riesgo cardiovascular

El sistema debe permitir listar los factores de riesgo cardiovascular, ordenados alfabéticamente, mostrando el nombre del factor de riesgo cardiovascular.

##### RF-17.1: Buscar factor de riesgo cardiovascular

El sistema debe permitir la búsqueda de factores de riesgo cardiovascular ingresando su nombre. Como respuesta se deberá mostrar un listado con aquellos factores de riesgo cardiovascular que coincidan con la búsqueda realizada.

#### RF-18: Modificar factor de riesgo cardiovascular

El sistema debe permitir modificar los factores de riesgo cardiovascular. Se podrán modificar los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre del factor de riesgo cardiovascular debe ser único para cada factor de riesgo cardiovascular.

#### RF-19: Eliminar factor de riesgo cardiovascular

El sistema debe permitir eliminar factores de riesgo cardiovascular. El factor de riesgo a eliminar no debe estar asociado a un paciente para realizar la operación.

#### RF-20: Crear obra social

El sistema debe permitir crear una obra social con los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre de la obra social debe ser único para cada obra social.

#### RF-21: Listar obras sociales

El sistema debe permitir listar las obras sociales, ordenadas alfabéticamente, mostrando los siguientes datos:

- Nombre

##### RF-21.1: Buscar obra social

El sistema debe permitir la búsqueda de una obra social ingresando su nombre. Como respuesta se deberá mostrar un listado con aquellas obras sociales que coincidan con la búsqueda realizada.

#### RF-22: Modificar obra social

El sistema debe permitir modificar las obras sociales. Se podrán modificar los siguientes datos:

- Nombre: texto, máximo 30 caracteres.

El nombre de la obra social debe ser único para cada obra social.

#### RF-23: Eliminar obra social

El sistema debe permitir eliminar obras sociales. La obra social a eliminar no debe estar asociada a una internación para realizar la operación.

#### RF-24: Crear paciente

El sistema debe permitir la carga de un paciente con los siguientes datos:

- Nombre: texto, máximo 50 caracteres.
- Apellido: texto, máximo 50 caracteres.
- Sexo: M/F.
- DNI: 7-9 caracteres alfanuméricos.
- Fecha de nacimiento: formato día/mes/año, no debe ser posterior a la fecha actual.
- Médico de cabecera: texto, máximo 100 caracteres, opcional.
- Contactos del paciente, pueden ser más de uno hasta 5, opcional:
  - Nombre: texto, máximo 50 caracteres.
  - Apellido: texto, máximo 50 caracteres, opcional.
  - Número de teléfono: máximo 15 dígitos.
  - Parentesco: texto, máximo 15 caracteres.
- Antecedentes: texto, opcional.
- Factores de riesgo cardiovascular: seleccionar uno o varios de un listado, opcional.

El DNI debe ser único para cada paciente.

#### RF-25: Modificar datos del paciente

El sistema debe permitir modificar los datos personales de un paciente. Los datos que pueden ser modificados son:

- Nombre: texto, máximo 50 caracteres.
- Apellido: texto, máximo 50 caracteres.
- Sexo: M/F.
- DNI: 7-9 caracteres alfanuméricos.
- Fecha de nacimiento: formato día/mes/año, no debe ser posterior a la fecha actual.
- Médico de cabecera: texto, máximo 100 caracteres, opcional.
- Contactos del paciente, pueden ser más de uno hasta 5, opcional:
  - Nombre: máximo 50 caracteres.
  - Apellido: máximo 50 caracteres, opcional.
  - Número de teléfono: máximo 15 dígitos.
  - Parentesco: texto, máximo 15 caracteres
- Antecedentes: texto, opcional.
- Factores de riesgo cardiovascular: seleccionar uno o varios de un listado, opcional.

El DNI debe ser único para cada paciente.

#### RF-26: Listar pacientes

El sistema debe permitir listar los pacientes registrados, mostrando los siguientes datos:

- Nombre
- Apellido
- Sexo
- DNI
- Edad
- Fecha de registro/carga

##### RF-26.1: Ordenar listado de pacientes

El sistema debe permitir ordenar los resultados del listado de pacientes de las siguientes maneras:

- Orden alfabético por apellido y nombre (ascendente y descendente).
- Orden cronológico de la fecha de carga más reciente a la más antigua o viceversa.
- Orden por edad de menor a mayor o viceversa.

##### RF-26.2: Filtrar listado de pacientes

El sistema debe permitir filtrar el resultado del listado de pacientes con los siguientes filtros:

- Motivo de internación: se deben mostrar todos los pacientes que tengan al menos una internación en la que se haya registrado el motivo de internación seleccionado.
- Factor de riesgo cardiovascular: se deben mostrar todos los pacientes que tengan registrado el factor de riesgo cardiovascular seleccionado.
- Fecha: se deben mostrar todos los pacientes con fecha de carga comprendida entre un período de fechas indicado.

##### RF-26.3: Buscar en el listado de pacientes

El sistema debe permitir buscar pacientes mediante el ingreso de valores para los siguientes datos y sus posibles combinaciones: DNI, nombre o apellido. Como respuesta se deberá mostrar un listado de pacientes en los que coincidan los términos especificados para cada campo.

#### RF-27: Bloquear cama por aislamiento

El sistema debe permitir bloquear una cama que esté en estado "Disponible". El estado de la cama deberá cambiar de "Disponible" a "En aislamiento" y no podrá ser seleccionada para próximas internaciones mientras esté en estado "En aislamiento".

#### RF-28: Desbloquear cama

El sistema debe permitir desbloquear una cama en estado "En aislamiento". El estado de la cama deberá cambiar de "En aislamiento" a "Disponible".

#### RF-29: Deshabilitar cama

El sistema debe permitir deshabilitar una cama en estado "Disponible". El estado de la cama deberá cambiar de "Disponible" a "Deshabilitada" y no podrá ser seleccionada para próximas internaciones mientras esté en estado "Deshabilitada".

#### RF-30: Habilitar cama

El sistema debe permitir habilitar una cama en estado "Deshabilitada". El estado de la cama deberá cambiar de "Deshabilitada" a "Disponible".

#### RF-31: Crear tipo de estudio

El sistema debe permitir crear un tipo de estudio con los siguientes datos:

- Nombre: texto, máximo 100 caracteres.

El nombre del tipo de estudio debe ser único para cada tipo de estudio.

#### RF-32: Listar tipos de estudios

El sistema debe permitir listar los tipos de estudio, ordenados alfabéticamente, mostrando el nombre del tipo de estudio.

##### RF-32.1: Buscar tipo de estudio

El sistema debe permitir la búsqueda de tipos de estudio ingresando el nombre de tipo de estudio. Como respuesta se deberá mostrar un listado con aquellos tipos de estudio que coincidan con la búsqueda realizada.

#### RF-33: Modificar tipo de estudio

El sistema debe permitir modificar los tipos de estudio. Se podrán modificar los siguientes datos:

- Nombre: texto, máximo 100 caracteres.

El nombre del tipo de estudio debe ser único para cada tipo de estudio.

#### RF-34: Eliminar tipo de estudio

El sistema debe permitir eliminar un tipo de estudio. El tipo de estudio a eliminar no debe estar asociado a ningún estudio para realizar la operación.

#### RF-35: Agregar estudio a un paciente

El sistema debe permitir agregar estudios a un paciente con los siguientes datos:

- Fecha de estudio: formato día/mes/año, no debe ser posterior a la fecha actual.
- Tipo de estudio: seleccionable de un listado de tipos de estudio.
- Título de estudio: texto, máximo 100 caracteres.
- Descripción: texto.

#### RF-36: Eliminar estudio de un paciente

El sistema debe permitir eliminar estudios de un paciente.

#### RF-37: Listar estudios de un paciente

El sistema debe permitir listar los estudios de un paciente ordenados por su fecha, de la más reciente a la más antigua.

##### RF-37.1: Filtrar listado de estudios de un paciente.

El sistema debe permitir filtrar el resultado del listado de estudios de un paciente con los siguientes filtros:

- Tipo de estudio: se deben mostrar aquellos estudios a los que les corresponda el tipo de estudio seleccionado.
- Fecha: se deben mostrar todos los estudios con fecha comprendida entre un período de fechas indicado.

#### RF-38: Agregar nota de evolución a un paciente internado

El sistema debe permitir agregar una nota de evolución a un paciente con los siguientes datos:

- Fecha de evolución: día/mes/año, no debe ser posterior a la fecha actual.
- Descripción: texto.

#### RF-39: Listar notas de evolución de un paciente

El sistema debe permitir listar las notas de evolución de un paciente en orden cronológico, de la fecha más reciente a la más antigua, mostrando los siguientes datos:

- Fecha de evolución
- Descripción

##### RF-39.1: Ordenar el listado de evoluciones de un paciente

El sistema debe permitir ordenar los resultados del listado de evoluciones de un paciente por su fecha, de la más reciente a la más antigua o viceversa.

##### RF-39.2: Filtrar el listado de evoluciones de un paciente.

El sistema debe permitir filtrar el resultado del listado de evoluciones de un paciente con los siguientes filtros:

- Fecha: se deben mostrar todas las evoluciones con fecha comprendida entre un período de fechas indicado.

#### RF-40: Crear tratamiento a un paciente internado

El sistema debe permitir crear un tratamiento para un paciente internado, con los siguientes datos:

- Paciente internado
- Descripción: texto.
- Fecha: valor por defecto fecha actual, no admite fechas 2 meses anteriores o posteriores a la fecha actual.

#### RF-41: Listar tratamientos de un paciente

El sistema debe permitir listar los tratamientos de un paciente mostrando los siguientes datos:

- Descripción.
- Fecha.

##### RF-41.1: Ordenar listado de tratamientos

El sistema debe permitir ordenar los resultados del listado de tratamientos de un paciente por su fecha de carga, de la más reciente a la más antigua o viceversa.

##### RF-41.2: Filtrar el listado de tratamientos de un paciente.

El sistema debe permitir filtrar el resultado del listado de tratamientos de un paciente con los siguientes filtros:

- Fecha: se deben mostrar todos los tratamientos con fecha comprendida entre un período de fechas indicado.

#### RF-42: Modificar último tratamiento de un paciente internado

El sistema debe permitir modificar el último tratamiento de un paciente internado, con los siguientes datos:

- Descripción: texto.
- Fecha: Opcional, no admite fechas 2 meses anteriores o posteriores a la fecha actual.

#### RF-43: Eliminar tratamiento de un paciente internado

El sistema debe permitir eliminar un tratamiento de un paciente internado.

#### RF-44: Agregar pendiente a un paciente internado

El sistema debe permitir agregar pendientes a un paciente con los siguientes datos:

- Título: texto, máximo 32 caracteres.
- Descripción: texto.

#### RF-45: Listar pendientes de un paciente

El sistema debe permitir listar los pendientes de un paciente mostrando los siguientes datos:

- Título
- Descripción
- Fecha de carga
- Fecha de resolución, si corresponde

##### RF-45.1: Ordenar listado de pendientes

El sistema debe permitir ordenar los resultados del listado de pendientes de un paciente de las siguientes maneras:

- Orden cronológico de la fecha de carga más reciente a la más antigua o viceversa.

##### RF-45.2: Filtrar listado de pendientes

El sistema debe permitir filtrar los resultados del listado de pendientes de un paciente con los siguientes filtros:

- Realizados: se deben mostrar todos los pendientes del paciente que tengan fecha de resolución.
- No realizados: se deben mostrar todos los pendientes del paciente que no tengan fecha de resolución.
- Fecha: se deben mostrar todos los pendientes con fecha de carga comprendida entre un período de fechas indicado.

#### RF-46: Registrar realización de pendiente a un paciente internado

El sistema debe permitir registrar la realización de un pendiente de un paciente internado. El pendiente quedará en estado "Realizado" y el sistema asignará la fecha actual como fecha de resolución.

#### RF-47: Crear internación de un paciente

El sistema debe permitir crear la internación de un paciente previamente registrado. El paciente al que se le asociará la internación no debe tener una internación en curso. La internación se debe registrar con los siguientes datos:

- Paciente.
- Fecha de ingreso: día/mes/año, la fecha no debe ser posterior a la fecha actual, fecha actual como valor por defecto.
- Cama: seleccionar de un listado de camas con estado "Disponible". Luego de la creación de la internación, la cama seleccionada pasará a tener el estado "Ocupada".
- Tipo de tratamiento: seleccionar entre UCO/Sala. Como valor por defecto, el mismo que el del sector de la cama seleccionada.
- Obra social: seleccionar de un listado.
- Motivos de internación: seleccionar de un listado, al menos uno.
- Aislamiento: campo de texto que describe el tipo de aislamiento, máximo 50 caracteres, opcional.
- Cama a bloquear por aislamiento: seleccionar de un listado, opcional. (ver RF-27)
- Parámetros/Antropometría: texto, opcional.
- Enfermedad actual: texto.
- Tratamiento actual: de forma opcional, se puede agregar un tratamiento al paciente como primera indicación (ver RF-40).
- Tratamiento previo: texto, opcional.
- Observaciones: texto, opcional.

#### RF-48: Listar internaciones de un paciente

El sistema debe permitir listar las internaciones de un paciente mostrando los siguientes datos:

- Fecha de ingreso
- Motivos de internación
- Fecha de egreso, si corresponde
- Condición de alta, si corresponde

##### RF-48.1: Ordenar listado de internaciones

El sistema debe permitir ordenar los resultados del listado de internaciones de un paciente por su fecha de ingreso, de la más reciente a la más antigua o viceversa.

##### RF-48.2: Filtrar el listado de internaciones de un paciente.

El sistema debe permitir filtrar el resultado del listado de internaciones de un paciente con los siguientes filtros:

- Fecha: se deben mostrar todas las internaciones con fecha comprendida entre un período de fechas indicado.

#### RF-49: Modificar internación de un paciente

El sistema debe permitir modificar la internación de un paciente. Para que la internación pueda ser modificada no debe tener una fecha de fin de internación registrada. Los datos que pueden ser modificados son:

- Motivo de internación: seleccionar de un listado, al menos uno.
- Fecha de ingreso: día/mes/año, la fecha no debe ser posterior a la fecha actual, fecha asignada previamente como valor por defecto.
- Obra social: seleccionar de un listado.
- Cama: seleccionar de un listado de camas.
  - Si el estado de la cama de destino es "Disponible" el sistema reasigna la cama al paciente y libera la cama de origen. La cama de origen quedará en estado "Disponible" y la cama de destino quedará en estado "Ocupada".
  - En caso de que la cama de destino se encuentre en estado "Ocupada", el sistema intercambia las camas asignadas entre ambos pacientes.
- Tipo de tratamiento: seleccionar entre UCO/Sala.
- Aislamiento: texto, máximo 50 caracteres.
- Cama a bloquear por aislamiento: seleccionar de un listado. (ver RF-27)
- Parámetros/Antropometría: texto.
- Enfermedad actual: texto.
- Tratamiento previo: texto.
- Observaciones: texto.

#### RF-50: Registrar fin de internación de un paciente

El sistema debe permitir registrar el fin de la internación de un paciente, con los siguientes datos:

- Condición de alta: seleccionable de un listado, la cual puede ser "Alta hospitalaria", "Óbito", "Traslado" o "Retiro voluntario".
- Fecha de egreso: día/mes/año, no debe ser posterior a la fecha actual ni anterior a la fecha de ingreso.

Luego de registrar el fin de internación, el sistema debe liberar la cama asociada a la internación. Dicha cama quedará en estado "Disponible".

### Requisitos no funcionales

- **Seguridad:** sólo podrán acceder al sistema usuarios autorizados mediante autenticación.
