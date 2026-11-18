# Épica: Administración de Usuarios (`EPIC-USUARIOS`)

## Descripción general
Esta épica comprende la gestión completa de las cuentas de usuario por parte del Administrador del sistema: el alta de nuevos profesionales, el reseteo administrativo de contraseñas, la visualización del listado completo con ordenamiento, filtros y búsqueda combinada, y la baja/eliminación de cuentas.

---

## Historias de Usuario

### HU-06: Crear usuario
- **Código SRS:** `RF-02`
- **Rol:** Usuario Administrador

#### Descripción
**Como** usuario administrador  
**Quiero** registrar un nuevo usuario en el sistema  
**Para** habilitar al personal médico o administrativo a operar en la plataforma.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Nombre:** texto, obligatorio, máximo 50 caracteres.
  - **Apellido:** texto, obligatorio, máximo 50 caracteres.
  - **Correo electrónico:** obligatorio, formato válido (`usuario@dominio`). Debe ser único en el sistema.
  - **Contraseña inicial:** obligatoria, texto de 6 a 12 caracteres, debe contener al menos una letra minúscula y un número.
- [ ] Si el correo electrónico ya existe registrado en otro usuario, debe rechazar el alta e informar la duplicidad.
- [ ] Debe validar en tiempo real o al enviar que la contraseña cumpla los requisitos de longitud y complejidad.
- [ ] Registra automáticamente la fecha de carga del usuario.

---

### HU-07: Cambiar contraseña de usuario por administrador
- **Código SRS:** `RF-07`
- **Rol:** Usuario Administrador

#### Descripción
**Como** usuario administrador  
**Quiero** restablecer o cambiar la contraseña de un usuario registrado  
**Para** permitirle recuperar el acceso a su cuenta en caso de extravío u olvido de credenciales.

#### Criterios de Aceptación
- [ ] Debe permitir seleccionar un usuario existente y definir una nueva contraseña.
- [ ] Debe solicitar los siguientes datos:
  - **Contraseña nueva:** obligatoria, texto de 6 a 12 caracteres, al menos una minúscula y un número.
  - **Reiteración de la contraseña nueva:** obligatoria, texto de 6 a 12 caracteres, al menos una minúscula y un número. El valor debe ser exactamente igual al de la nueva contraseña.
- [ ] No requiere que el administrador ingrese la contraseña anterior del usuario.
- [ ] Si las contraseñas no coinciden o no cumplen la regla de complejidad/longitud, debe impedir la modificación y mostrar el motivo.
- [ ] Al confirmarse, el usuario podrá iniciar sesión con su nueva clave.

---

### HU-08: Listar, ordenar, filtrar y buscar usuarios
- **Código SRS:** `RF-08`, `RF-08.1`, `RF-08.2`, `RF-08.3`
- **Rol:** Usuario Administrador

#### Descripción
**Como** usuario administrador  
**Quiero** visualizar el listado de usuarios con opciones de ordenamiento, filtros por fecha y búsqueda  
**Para** supervisar las cuentas activas y localizar rápidamente a un profesional en el sistema.

#### Criterios de Aceptación
- [ ] **Visualización básica:** Muestra una tabla con los siguientes datos por cada usuario:
  - Nombre
  - Apellido
  - Correo electrónico
  - Fecha de carga
- [ ] **Ordenamiento (RF-08.1):** Permite ordenar los resultados por:
  - Alfabéticamente por apellido y nombre (ascendente y descendente).
  - Cronológicamente por fecha de carga (más reciente a más antigua y viceversa).
- [ ] **Filtrado (RF-08.2):**
  - Permite filtrar por rango de fecha de carga (fecha desde y fecha hasta). Muestra únicamente los usuarios creados en ese período.
- [ ] **Búsqueda combinada (RF-08.3):**
  - Permite ingresar criterios de búsqueda para correo electrónico, nombre y/o apellido, soportando combinaciones de estos campos.
  - Retorna aquellos usuarios que coincidan con los términos especificados.
- [ ] Si la búsqueda o filtro no arroja resultados, debe mostrar un mensaje amigable indicándolo.

---

### HU-09: Eliminar usuario
- **Código SRS:** `RF-09`
- **Rol:** Usuario Administrador

#### Descripción
**Como** usuario administrador  
**Quiero** eliminar un usuario registrado  
**Para** revocar definitivamente el acceso a personas desvinculadas del servicio.

#### Criterios de Aceptación
- [ ] Permite seleccionar a un usuario del listado y solicitar su eliminación.
- [ ] Debe solicitar confirmación explícita antes de ejecutar la baja para evitar eliminaciones accidentales.
- [ ] Una vez eliminado, el usuario ya no podrá iniciar sesión y no aparecerá en el listado activo de usuarios.
