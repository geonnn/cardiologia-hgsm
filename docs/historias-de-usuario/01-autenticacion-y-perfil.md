# Épica: Autenticación y Perfil de Usuario (`EPIC-AUTENTICACION`)

## Descripción general
Esta épica abarca los mecanismos de acceso seguro al sistema (tanto para usuarios del servicio asistencial como para administradores en su panel respectivo), el cierre de sesión y la autogestión de la información del perfil propio (modificación de datos personales y cambio de contraseña).

---

## Historias de Usuario

### HU-01: Autenticación en panel de administración
- **Código SRS:** `RF-01`
- **Rol:** Usuario Administrador

#### Descripción
**Como** usuario administrador  
**Quiero** autenticarme con mis credenciales en el acceso al panel de administración  
**Para** gestionar los parámetros globales y usuarios del sistema de forma segura.

#### Criterios de Aceptación
- [ ] Debe solicitar **Correo electrónico** con formato válido (`usuario@dominio`).
- [ ] Debe solicitar **Contraseña**.
- [ ] Debe validar que las credenciales coincidan y correspondan a un usuario con rol de Administrador antes de conceder acceso al panel.
- [ ] Si las credenciales son incorrectas o el usuario no posee rol de administrador, debe mostrar un mensaje de error claro sin develar si falló el correo o la clave.
- [ ] Los campos son de ingreso obligatorio.

---

### HU-02: Iniciar sesión de usuario
- **Código SRS:** `RF-03`
- **Rol:** Usuario del Servicio

#### Descripción
**Como** personal del Servicio de Cardiología  
**Quiero** iniciar sesión con mi correo electrónico y contraseña  
**Para** acceder a las funciones asistenciales y operativas del sistema de internación.

#### Criterios de Aceptación
- [ ] Debe solicitar **Correo electrónico** con formato válido (`usuario@dominio`).
- [ ] Debe solicitar **Contraseña**.
- [ ] Debe validar las credenciales contra la base de usuarios registrados.
- [ ] En caso de éxito, redirige a la vista principal de trabajo (censo de camas / pacientes).
- [ ] Si las credenciales son inválidas, debe denegar el acceso y notificar al usuario con un mensaje de error seguro.
- [ ] Todos los campos son obligatorios.

---

### HU-03: Cerrar sesión
- **Código SRS:** `RF-04`
- **Rol:** Usuario con sesión activa (Asistencial / Administrador)

#### Descripción
**Como** usuario con sesión activa  
**Quiero** cerrar mi sesión actual  
**Para** proteger la privacidad de los datos médicos de los pacientes cuando no esté utilizando la terminal.

#### Criterios de Aceptación
- [ ] La opción de cerrar sesión debe estar disponible y visible en todo momento desde la barra de navegación o menú de usuario.
- [ ] Al seleccionar "Cerrar sesión", se debe invalidar el token o la sesión activa en el servidor/cliente.
- [ ] Redirige inmediatamente a la pantalla de inicio de sesión.
- [ ] El usuario no debe poder retroceder mediante el historial del navegador a páginas protegidas sin volver a autenticarse.

---

### HU-04: Modificar datos de perfil propio
- **Código SRS:** `RF-05`
- **Rol:** Usuario con sesión activa

#### Descripción
**Como** usuario con sesión activa  
**Quiero** modificar mis datos personales de identificación  
**Para** mantener actualizada mi información en el sistema.

#### Criterios de Aceptación
- [ ] Permite modificar los siguientes campos:
  - **Nombre:** texto, obligatorio, máximo 50 caracteres.
  - **Apellido:** texto, obligatorio, máximo 50 caracteres.
- [ ] No permite modificar el correo electrónico desde este formulario.
- [ ] Valida que no se envíen campos vacíos ni espacios en blanco.
- [ ] Al guardar, refleja los cambios de inmediato en la sesión del usuario.

---

### HU-05: Cambiar contraseña propia
- **Código SRS:** `RF-06`
- **Rol:** Usuario con sesión activa

#### Descripción
**Como** usuario con sesión activa  
**Quiero** cambiar mi contraseña actual  
**Para** renovar periódicamente mi clave de seguridad o proteger mi cuenta ante sospechas de vulnerabilidad.

#### Criterios de Aceptación
- [ ] Debe solicitar los siguientes datos:
  - **Contraseña actual:** obligatoria, debe validarse contra la contraseña vigente del usuario.
  - **Contraseña nueva:** obligatoria, texto de 6 a 12 caracteres, debe contener al menos una letra minúscula y un número.
  - **Reiteración de contraseña nueva:** obligatoria, debe coincidir de forma idéntica con la nueva contraseña ingresada.
- [ ] Si la contraseña actual no coincide, la operación debe ser rechazada informando el error.
- [ ] Si la nueva contraseña no cumple con la política de seguridad (mínimo 6 caracteres, máximo 12 caracteres, al menos 1 minúscula y 1 número), debe indicarse claramente al usuario.
- [ ] Si la reiteración no coincide exactamente, debe indicarse la discrepancia y no persistir el cambio.
- [ ] Al confirmarse el cambio con éxito, se actualiza la clave y se emite notificación de éxito.
