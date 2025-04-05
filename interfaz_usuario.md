# Diseño de Interfaz de Usuario - Aplicación SAP Fiori de Gestión de Vacaciones

## Estructura General de la Aplicación

La aplicación de gestión de vacaciones seguirá los principios de diseño de SAP Fiori, con una interfaz limpia, intuitiva y responsiva que se adapte a diferentes dispositivos. La estructura general se basa en el patrón de navegación por pestañas con un área principal de contenido.

## Componentes Principales

### 1. Barra de Navegación Superior
- Logo y título de la aplicación
- Pestañas de navegación principales:
  - Ausencias
  - Mi calendario
  - Mi equipo
  - Saldos
  - Solicitudes
  - Informes
  - Administración
- Buscador global
- Iconos de configuración, ayuda y perfil de usuario

### 2. Panel Lateral Izquierdo
- Navegación rápida a funciones principales
- Acceso a perfil de usuario
- Indicadores visuales de estado

### 3. Área Principal de Contenido
- Vista de calendario (mensual, anual)
- Formularios de solicitud
- Listados de solicitudes
- Paneles de administración

### 4. Barra de Estado Inferior
- Contadores de días:
  - Disponibles
  - Totales
  - Disfrutados
  - Pendientes

## Diseño Detallado de Pantallas

### 1. Vista Principal de Calendario

```
+-----------------------------------------------------------------------+
| [Logo] Ausencias | Mi calendario | Mi equipo | Saldos | ...     [🔍] [⚙️] [👤] |
+-----------------------------------------------------------------------+
| [◀] |                         2024                           | [▶]    |
+-----------------------------------------------------------------------+
| [👤]  |  [Vista Calendario] [Vista Lista]                             |
| Perfil|                                                               |
|       |  12d Disponible | 23d Total | 3d Disfrutados | 0d Pendientes  |
|       |                                                               |
| [📅]  |  2 Enero, 2024 - 1 Enero, 2025                    [Acciones]  |
| Cal.  |                                                               |
|       |  +-------------------------------------------------------+    |
| [📊]  |  |                      Enero                           |    |
| Saldos|  | Lu | Ma | Mi | Ju | Vi | Sa | Do |                   |    |
|       |  | 1  | 2  | 3  | 4  | 5  | 6  | 7  |                   |    |
| [📝]  |  | 8  | 9  | 10 | 11 | 12 | 13 | 14 |                   |    |
| Solic.|  | 15 | 16 | 17 | 18 | 19 | 20 | 21 |                   |    |
|       |  | 22 | 23 | 24 | 25 | 26 | 27 | 28 |                   |    |
| [📋]  |  | 29 | 30 | 31 |    |    |    |    |                   |    |
| Inform|  +-------------------------------------------------------+    |
|       |                                                               |
| [⚙️]   |  Ausencias por tipo:                                          |
| Admin.|  □ Mudanza        2                                           |
|       |  □ Baja (leve)    4                                           |
|       |  □ Vacaciones    12                                           |
|       |  □ Sobre tiempo   6                                           |
|       |                                                               |
|       |  Convenio y calendario:                                       |
|       |  □ Convenio Consultoría                                       |
|       |  □ Ciudad Real                                                |
|       |                                                               |
+-----------------------------------------------------------------------+
|                    [+ Solicitar ausencia]                             |
+-----------------------------------------------------------------------+
```

### 2. Formulario de Solicitud de Ausencia

```
+-----------------------------------------------------------------------+
| [Logo] Ausencias | Mi calendario | Mi equipo | Saldos | ...     [🔍] [⚙️] [👤] |
+-----------------------------------------------------------------------+
|                     Nueva Solicitud de Ausencia                        |
+-----------------------------------------------------------------------+
| Tipo de ausencia: [Vacaciones ▼]                                       |
|                                                                        |
| Fecha inicio:     [01/07/2024]     Fecha fin: [15/07/2024]             |
|                                                                        |
| Total días:       11 días laborables                                   |
|                                                                        |
| Comentarios:      [                                                  ] |
|                   [                                                  ] |
|                                                                        |
| Adjuntar justificante: [Seleccionar archivo]                           |
|                                                                        |
| Aprobador:        [Juan Pérez (Responsable) ▼]                         |
|                                                                        |
|                                                                        |
|                   [Cancelar]    [Enviar solicitud]                     |
+-----------------------------------------------------------------------+
```

### 3. Vista de Mi Equipo (para Responsables)

```
+-----------------------------------------------------------------------+
| [Logo] Ausencias | Mi calendario | Mi equipo | Saldos | ...     [🔍] [⚙️] [👤] |
+-----------------------------------------------------------------------+
|                           Mi Equipo                                    |
+-----------------------------------------------------------------------+
| Filtrar por: [Todos ▼]    Periodo: [2024 ▼]    [Buscar empleado...]    |
+-----------------------------------------------------------------------+
| Solicitudes pendientes de aprobación (3)                               |
+-----------------------------------------------------------------------+
| Empleado          | Tipo        | Fechas              | Días | Acciones |
|-------------------|-------------|---------------------|------|----------|
| Ana García        | Vacaciones  | 10/06/24 - 21/06/24 | 10   | [✓] [✗]  |
| Carlos Rodríguez  | Baja        | 15/05/24 - 17/05/24 | 3    | [✓] [✗]  |
| María López       | Mudanza     | 01/06/24            | 1    | [✓] [✗]  |
+-----------------------------------------------------------------------+
| Calendario del equipo                                                  |
+-----------------------------------------------------------------------+
| [Vista mensual ▼]  [◀ Anterior]  Mayo 2024  [Siguiente ▶]              |
|                                                                        |
| Empleado          | 1 | 2 | 3 | 4 | 5 | ... | 29 | 30 | 31 |           |
|-------------------|---|---|---|---|---|-----|----|----|----|-----------| 
| Ana García        |   |   |   |   |   |     |    |    |    |           |
| Carlos Rodríguez  |   |   |   |   |   |     |    |    |    |           |
| María López       |   |   |   |   |   |     |    |    |    |           |
| Pedro Martínez    |   |   |   |   |   |     |    |    |    |           |
| Laura Sánchez     |   |   |   |   |   |     |    |    |    |           |
+-----------------------------------------------------------------------+
| Leyenda: [■] Vacaciones [■] Baja [■] Mudanza [■] Sobre tiempo          |
+-----------------------------------------------------------------------+
```

### 4. Vista de Saldos

```
+-----------------------------------------------------------------------+
| [Logo] Ausencias | Mi calendario | Mi equipo | Saldos | ...     [🔍] [⚙️] [👤] |
+-----------------------------------------------------------------------+
|                           Mis Saldos                                   |
+-----------------------------------------------------------------------+
| Periodo: [2024 ▼]                                                      |
+-----------------------------------------------------------------------+
| Tipo de ausencia    | Total | Disfrutados | Planificados | Disponibles |
|---------------------|-------|-------------|--------------|-------------|
| Vacaciones          | 23    | 3           | 0            | 20          |
| Días personales     | 6     | 2           | 0            | 4           |
| Formación           | 5     | 0           | 0            | 5           |
| Compensación        | 2     | 0           | 0            | 2           |
+-----------------------------------------------------------------------+
| Histórico de ausencias                                                 |
+-----------------------------------------------------------------------+
| Tipo        | Fechas              | Días | Estado    | Comentarios     |
|-------------|---------------------|------|-----------|-----------------|
| Vacaciones  | 01/03/24 - 03/03/24 | 3    | Aprobada  | Puente          |
| Personal    | 15/02/24 - 16/02/24 | 2    | Aprobada  | Asuntos propios |
+-----------------------------------------------------------------------+
| Evolución anual                                                        |
|                                                                        |
| [Gráfico de barras mostrando uso de vacaciones por mes]                |
|                                                                        |
+-----------------------------------------------------------------------+
```

### 5. Vista de Administración

```
+-----------------------------------------------------------------------+
| [Logo] Ausencias | Mi calendario | Mi equipo | Saldos | ...     [🔍] [⚙️] [👤] |
+-----------------------------------------------------------------------+
|                         Administración                                 |
+-----------------------------------------------------------------------+
| [Tipos de ausencia] [Días festivos] [Flujos de aprobación] [Informes]  |
+-----------------------------------------------------------------------+
| Tipos de ausencia                                                      |
+-----------------------------------------------------------------------+
| ID  | Descripción      | Color  | Requiere    | Descuenta | Estado     |
|     |                  |        | aprobación  | de cuota  |            |
|-----|------------------|--------|-------------|-----------|------------|
| VAC | Vacaciones       | #4CAF50| Sí          | Sí        | Activo     |
| MUD | Mudanza          | #FFC107| Sí          | No        | Activo     |
| BAJ | Baja (enfermedad)| #F44336| Sí          | No        | Activo     |
| SOB | Sobre tiempo     | #2196F3| Sí          | No        | Activo     |
| CON | Convenio Consult.| #9C27B0| Sí          | No        | Activo     |
| CIU | Ciudad Real      | #795548| Sí          | No        | Activo     |
+-----------------------------------------------------------------------+
| [+ Añadir tipo]                                                        |
+-----------------------------------------------------------------------+
```

## Componentes UI5 Principales

### 1. Calendario
- Componente: `sap.m.PlanningCalendar`
- Características:
  - Vista mensual y anual
  - Codificación por colores según tipo de ausencia
  - Indicadores de estado (aprobado, pendiente, rechazado)
  - Interacción para selección de días

### 2. Formularios
- Componentes: `sap.ui.layout.form.SimpleForm`
- Características:
  - Validación de campos
  - Cálculo automático de días laborables
  - Selección de fechas con `sap.m.DatePicker`
  - Carga de archivos con `sap.ui.unified.FileUploader`

### 3. Tablas
- Componente: `sap.m.Table`
- Características:
  - Ordenación y filtrado
  - Paginación
  - Acciones en línea
  - Exportación de datos

### 4. Gráficos
- Componente: `sap.viz.ui5.controls.VizFrame`
- Características:
  - Visualización de saldos
  - Estadísticas de uso
  - Filtros interactivos

## Flujos de Interacción

### 1. Solicitud de Ausencia
1. Usuario navega a "Ausencias" o "Mi calendario"
2. Hace clic en "+ Solicitar ausencia"
3. Completa formulario con tipo, fechas y comentarios
4. Sistema calcula automáticamente días laborables
5. Usuario envía solicitud
6. Sistema muestra confirmación y actualiza calendario

### 2. Aprobación de Solicitud
1. Responsable recibe notificación
2. Navega a "Mi equipo"
3. Visualiza solicitudes pendientes
4. Selecciona solicitud para ver detalles
5. Aprueba o rechaza con comentarios
6. Sistema notifica al solicitante y actualiza estados

### 3. Consulta de Calendario
1. Usuario navega a "Mi calendario"
2. Visualiza ausencias programadas
3. Puede filtrar por tipo de ausencia
4. Puede cambiar entre vista mensual y anual
5. Puede hacer clic en un día para ver detalles o solicitar ausencia

## Diseño Responsivo

La aplicación se adaptará a diferentes tamaños de pantalla:

### Escritorio
- Vista completa con todas las funcionalidades
- Panel lateral siempre visible
- Calendario en formato amplio

### Tablet
- Panel lateral colapsable
- Ajuste de tamaño de calendario
- Optimización de formularios

### Móvil
- Panel lateral oculto (accesible mediante menú hamburguesa)
- Vista simplificada del calendario
- Formularios adaptados a pantalla pequeña

## Paleta de Colores

- **Colores Principales**:
  - Azul corporativo: #1D4F91
  - Blanco: #FFFFFF
  - Gris claro: #F5F5F5
  - Gris oscuro: #333333

- **Colores de Estado**:
  - Aprobado: #4CAF50 (verde)
  - Pendiente: #FFC107 (amarillo)
  - Rechazado: #F44336 (rojo)

- **Colores de Tipos de Ausencia**:
  - Vacaciones: #4CAF50 (verde)
  - Mudanza: #FFC107 (amarillo)
  - Baja: #F44336 (rojo)
  - Sobre tiempo: #2196F3 (azul)
  - Convenio Consultoría: #9C27B0 (púrpura)
  - Ciudad Real: #795548 (marrón)

## Iconografía

Se utilizará el conjunto de iconos estándar de SAP Fiori (SAP-icons) para mantener la consistencia con otras aplicaciones SAP:

- Calendario: `sap-icon://calendar`
- Usuario: `sap-icon://person-placeholder`
- Equipo: `sap-icon://group`
- Solicitud: `sap-icon://request`
- Aprobación: `sap-icon://accept`
- Rechazo: `sap-icon://decline`
- Configuración: `sap-icon://settings`
- Informes: `sap-icon://bar-chart`
- Notificación: `sap-icon://notification`
- Adjunto: `sap-icon://attachment`

## Accesibilidad

La aplicación cumplirá con los estándares de accesibilidad WCAG 2.1:

- Contraste adecuado entre texto y fondo
- Etiquetas descriptivas para todos los campos
- Navegación completa por teclado
- Compatibilidad con lectores de pantalla
- Mensajes de error claros y descriptivos
- Textos alternativos para elementos visuales

## Animaciones y Transiciones

- Transiciones suaves entre vistas (300ms)
- Animación de carga para operaciones asíncronas
- Efectos de hover sutiles para elementos interactivos
- Notificaciones con animación de entrada/salida
- Indicadores visuales para cambios de estado

## Mensajes y Notificaciones

- **Mensajes de Éxito**:
  - Fondo verde
  - Icono de verificación
  - Desaparición automática tras 3 segundos

- **Mensajes de Error**:
  - Fondo rojo
  - Icono de advertencia
  - Requiere acción del usuario para cerrar

- **Mensajes de Advertencia**:
  - Fondo amarillo
  - Icono de información
  - Desaparición automática tras 5 segundos

- **Diálogos de Confirmación**:
  - Para acciones irreversibles
  - Botones de confirmar/cancelar claramente diferenciados
  - Explicación clara de las consecuencias
