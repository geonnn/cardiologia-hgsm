# Índice de Épicas e Historias de Usuario

**Proyecto:** Servicio de Cardiología - Hospital General San Martín (`cardiologia-hgsm`)  
**Documento base:** [SRS - Cardiología San Martín.md](../SRS%20-%20Cardiolog%C3%ADa%20San%20Mart%C3%ADn.md)

---

## Estructura de Documentación

Las historias de usuario están estructuradas según la siguiente granularidad: los sub-requisitos de búsqueda, filtrado y ordenamiento se encuentran incorporados dentro de los Criterios de Aceptación de cada historia de listado.

Cada épica cuenta con su propio documento detallado con formato estándar:
- **Como** [rol] **Quiero** [funcionalidad] **Para** [beneficio de negocio].
- **Criterios de Aceptación:** Checklist detallado con validaciones de tipos de datos, longitudes, valores por defecto, transiciones de estado y restricciones de integridad referencial.

---

## Tabla de Épicas y Archivos

| # | Código de Épica | Nombre de la Épica | Archivo | Requisitos SRS | Total HUs |
|:---|:---|:---|:---|:---|:---:|
| **1** | `EPIC-AUTENTICACION` | Autenticación y Perfil de Usuario | [01-autenticacion-y-perfil.md](./01-autenticacion-y-perfil.md) | RF-01, RF-03, RF-04, RF-05, RF-06 | 5 |
| **2** | `EPIC-USUARIOS` | Administración de Usuarios | [02-administracion-de-usuarios.md](./02-administracion-de-usuarios.md) | RF-02, RF-07, RF-08 (8.1, 8.2, 8.3), RF-09 | 4 |
| **3** | `EPIC-CAMAS` | Gestión de Camas y Sectores | [03-gestion-de-camas-y-sectores.md](./03-gestion-de-camas-y-sectores.md) | RF-10, RF-11 (11.1), RF-27, RF-28, RF-29, RF-30 | 6 |
| **4** | `EPIC-PACIENTES` | Padrón de Pacientes | [04-padron-de-pacientes.md](./04-padron-de-pacientes.md) | RF-24, RF-25, RF-26 (26.1, 26.2, 26.3) | 3 |
| **5** | `EPIC-INTERNACION` | Ciclo de Internación | [05-ciclo-de-internacion.md](./05-ciclo-de-internacion.md) | RF-47, RF-48 (48.1, 48.2), RF-49, RF-50 | 4 |
| **6** | `EPIC-EVOLUCIONES` | Evoluciones Clínicas | [06-evoluciones-clinicas.md](./06-evoluciones-clinicas.md) | RF-38, RF-39 (39.1, 39.2) | 2 |
| **7** | `EPIC-TRATAMIENTOS` | Tratamientos e Indicaciones | [07-tratamientos-e-indicaciones.md](./07-tratamientos-e-indicaciones.md) | RF-40, RF-41 (41.1, 41.2), RF-42, RF-43 | 4 |
| **8** | `EPIC-ESTUDIOS` | Estudios Complementarios | [08-estudios-complementarios.md](./08-estudios-complementarios.md) | RF-35, RF-36, RF-37 (37.1) | 3 |
| **9** | `EPIC-PENDIENTES` | Gestión de Pendientes | [09-gestion-de-pendientes.md](./09-gestion-de-pendientes.md) | RF-44, RF-45 (45.1, 45.2), RF-46 | 3 |
| **10** | `EPIC-CAT-MOTIVOS` | Catálogo: Motivos de Internación | [10-catalogo-motivos-de-internacion.md](./10-catalogo-motivos-de-internacion.md) | RF-12, RF-13 (13.1), RF-14, RF-15 | 4 |
| **11** | `EPIC-CAT-FRCV` | Catálogo: Factores de Riesgo CV | [11-catalogo-factores-de-riesgo-cv.md](./11-catalogo-factores-de-riesgo-cv.md) | RF-16, RF-17 (17.1), RF-18, RF-19 | 4 |
| **12** | `EPIC-CAT-OBRAS-SOCIALES` | Catálogo: Obras Sociales | [12-catalogo-obras-sociales.md](./12-catalogo-obras-sociales.md) | RF-20, RF-21 (21.1), RF-22, RF-23 | 4 |
| **13** | `EPIC-CAT-TIPOS-ESTUDIO` | Catálogo: Tipos de Estudio | [13-catalogo-tipos-de-estudio.md](./13-catalogo-tipos-de-estudio.md) | RF-31, RF-32 (32.1), RF-33, RF-34 | 4 |

**Total de Historias de Usuario:** 50 HUs (cubriendo la totalidad de RF-01 al RF-50 con sus sub-requisitos correspondientes).
