# Documentación de la Aplicación SAP Fiori de Gestión de Vacaciones

## Índice

1. [Introducción](#introducción)
2. [Manual de Usuario](#manual-de-usuario)
3. [Guía de Implementación](#guía-de-implementación)
4. [Documentación Técnica](#documentación-técnica)
5. [Documentación de Mantenimiento](#documentación-de-mantenimiento)

## Introducción

La aplicación SAP Fiori de Gestión de Vacaciones es una solución integral diseñada para facilitar la gestión de ausencias y vacaciones de los empleados en una organización. Esta aplicación permite a los empleados solicitar diferentes tipos de ausencias, a los responsables aprobar o rechazar estas solicitudes, y a los administradores configurar los parámetros del sistema.

Esta documentación proporciona información detallada sobre el uso, implementación, aspectos técnicos y mantenimiento de la aplicación.

## Manual de Usuario

### 1. Visión General

La aplicación de Gestión de Vacaciones ofrece las siguientes funcionalidades principales:

- Visualización de calendario de ausencias personal y de equipo
- Solicitud de diferentes tipos de ausencias
- Aprobación/rechazo de solicitudes
- Gestión de saldos de vacaciones
- Administración de tipos de ausencias y configuraciones

### 2. Acceso a la Aplicación

Para acceder a la aplicación:

1. Inicie sesión en el portal Fiori de su organización
2. Localice la aplicación "Gestión de Vacaciones" en el launchpad
3. Haga clic en el icono para abrir la aplicación

### 3. Interfaz Principal

La interfaz principal de la aplicación está organizada en pestañas:

- **Ausencias**: Vista general de ausencias
- **Mi calendario**: Calendario personal de ausencias
- **Mi equipo**: Calendario y solicitudes del equipo (solo para responsables)
- **Saldos**: Visualización de saldos de vacaciones
- **Solicitudes**: Gestión de solicitudes propias
- **Informes**: Informes y estadísticas
- **Administración**: Configuración del sistema (solo para administradores)

En la parte inferior de la pantalla se muestran contadores con:
- Días disponibles
- Días totales
- Días disfrutados
- Días pendientes

### 4. Solicitar una Ausencia

Para solicitar una ausencia:

1. Haga clic en el botón "+ Solicitar ausencia" en la parte inferior de la pantalla
2. Seleccione el tipo de ausencia (Vacaciones, Mudanza, Baja, etc.)
3. Seleccione la fecha de inicio y la fecha de fin
4. Verifique el número de días laborables calculado automáticamente
5. Añada comentarios si es necesario
6. Adjunte documentación si el tipo de ausencia lo requiere
7. Haga clic en "Enviar solicitud"

La solicitud se enviará a su responsable para aprobación y aparecerá en su calendario con estado "Pendiente".

### 5. Visualizar el Calendario

El calendario muestra sus ausencias programadas y puede ser personalizado:

1. Cambie entre vistas (día, semana, mes, año) usando los botones de segmentación
2. Navegue entre períodos usando las flechas de navegación
3. Filtre por tipo de ausencia usando la lista en la parte inferior
4. Haga clic en una ausencia para ver sus detalles
5. Seleccione un intervalo de fechas para crear una nueva solicitud

Los colores en el calendario indican diferentes tipos de ausencias:
- Verde: Vacaciones
- Amarillo: Mudanza
- Rojo: Baja por enfermedad
- Azul: Sobre tiempo
- Púrpura: Convenio Consultoría
- Marrón: Ciudad Real

### 6. Gestionar Solicitudes

Para gestionar sus solicitudes:

1. Navegue a la pestaña "Solicitudes"
2. Vea el estado de sus solicitudes (Pendiente, Aprobada, Rechazada, Cancelada)
3. Seleccione una solicitud para ver sus detalles
4. Puede cancelar solicitudes pendientes haciendo clic en "Cancelar"

### 7. Aprobar Solicitudes (para Responsables)

Si es responsable de un equipo:

1. Navegue a la pestaña "Mi equipo"
2. Vea las solicitudes pendientes de aprobación
3. Seleccione una solicitud para ver sus detalles
4. Haga clic en "Aprobar" o "Rechazar"
5. Añada comentarios si es necesario, especialmente en caso de rechazo
6. Confirme su decisión

### 8. Visualizar Saldos

Para ver sus saldos de vacaciones:

1. Navegue a la pestaña "Saldos"
2. Seleccione el año para ver los saldos correspondientes
3. Vea el desglose por tipo de ausencia
4. Consulte el histórico de ausencias
5. Visualice la evolución anual en el gráfico

### 9. Administración (para Administradores)

Si tiene rol de administrador:

1. Navegue a la pestaña "Administración"
2. Seleccione la sección que desea gestionar:
   - Tipos de ausencia
   - Días festivos
   - Flujos de aprobación
   - Informes
3. Realice las configuraciones necesarias

### 10. Preguntas Frecuentes

**¿Cómo sé si mi solicitud ha sido aprobada?**
Recibirá una notificación por correo electrónico y podrá ver el estado actualizado en la pestaña "Solicitudes".

**¿Puedo modificar una solicitud enviada?**
No puede modificar una solicitud enviada, pero puede cancelarla si aún está pendiente y crear una nueva.

**¿Cómo se calculan los días laborables?**
El sistema considera días laborables de lunes a viernes, excluyendo días festivos configurados en el sistema.

**¿Qué hago si necesito adjuntar un justificante después de enviar la solicitud?**
Contacte con su responsable o con el departamento de RRHH para que le indiquen cómo proceder.

## Guía de Implementación

### 1. Requisitos Previos

#### Requisitos de Sistema

- **SAP Backend**: SAP ECC 6.0 o S/4HANA
- **SAP Gateway**: SAP Gateway 2.0 o superior
- **SAPUI5**: Versión 1.84 o superior
- **Navegadores soportados**: Chrome, Firefox, Safari, Edge (últimas versiones)

#### Roles y Autorizaciones

Se requieren los siguientes roles SAP:

- **ZHR_VACATION_EMPLOYEE**: Para empleados estándar
- **ZHR_VACATION_MANAGER**: Para responsables/supervisores
- **ZHR_VACATION_ADMIN**: Para administradores

### 2. Instalación

#### Preparación del Sistema

1. Verifique que el sistema cumple con los requisitos previos
2. Asegúrese de que SAP Gateway está configurado correctamente
3. Verifique que los usuarios tienen los roles necesarios

#### Importación de Componentes Backend

1. Importe el transporte con los objetos ABAP:
   ```
   RHRK900123.ZIP
   ```

2. Verifique la importación correcta de:
   - Tablas de base de datos (ZHR_EMPLOYEES, ZHR_ABSENCE_TYPES, etc.)
   - Clases ABAP (ZCL_HR_VACATION_MODEL, ZCL_HR_VACATION_SERVICE, etc.)
   - Servicios OData (ZHR_VACATION_SRV)

3. Active el servicio OData en la transacción `/IWFND/MAINT_SERVICE`

#### Despliegue de la Aplicación Frontend

1. Importe el archivo ZIP de la aplicación Fiori en SAP Web IDE o Business Application Studio:
   ```
   com.vacaciones.app.zip
   ```

2. Configure el destino en el archivo `neo-app.json` o `xs-app.json`

3. Construya y despliegue la aplicación en el portal Fiori

4. Configure el tile en el launchpad Fiori

### 3. Configuración

#### Configuración Inicial

1. Acceda a la aplicación con un usuario administrador
2. Navegue a la pestaña "Administración"
3. Configure los tipos de ausencia básicos:
   - Vacaciones
   - Mudanza
   - Baja (enfermedad)
   - Sobre tiempo
   - Convenio Consultoría
   - Ciudad Real

4. Configure los días festivos para el año en curso

5. Configure los flujos de aprobación:
   - Aprobación estándar (un nivel)
   - Aprobación multinivel (si es necesario)

#### Configuración de Empleados

1. Importe los datos de empleados usando la transacción estándar o mediante un programa de carga
2. Asigne los saldos iniciales de vacaciones
3. Configure la jerarquía organizativa para la aprobación de solicitudes

#### Configuración de Notificaciones

1. Configure las plantillas de correo electrónico en la tabla `ZHR_EMAIL_TEMPLATES`
2. Verifique la configuración del servidor SMTP
3. Active las notificaciones en la configuración de la aplicación

### 4. Integración

#### Integración con SAP HCM / SuccessFactors

Para integrar con el sistema de gestión de recursos humanos:

1. Configure los jobs de sincronización para datos de empleados
2. Configure la sincronización de jerarquía organizativa
3. Configure la sincronización de saldos de vacaciones

#### Integración con Sistemas de Calendario

Para integrar con sistemas de calendario externos:

1. Active la funcionalidad de exportación iCal
2. Configure los parámetros de sincronización
3. Verifique los permisos necesarios

### 5. Pruebas

#### Plan de Pruebas

1. Ejecute las pruebas unitarias incluidas en el transporte
2. Realice pruebas de integración entre backend y frontend
3. Ejecute pruebas funcionales para los flujos principales:
   - Solicitud de ausencia
   - Aprobación de solicitud
   - Visualización de calendario
   - Gestión de saldos

4. Verifique la correcta visualización en diferentes dispositivos

#### Verificación Post-Implementación

1. Verifique el acceso de usuarios con diferentes roles
2. Compruebe la correcta visualización de saldos
3. Verifique el flujo completo de solicitud y aprobación
4. Compruebe la generación de notificaciones

### 6. Go-Live

#### Checklist Pre-Go-Live

1. Verificación final de configuración
2. Carga de datos maestros completa
3. Pruebas de rendimiento satisfactorias
4. Formación de usuarios completada
5. Plan de soporte establecido

#### Actividades Post-Go-Live

1. Monitorización del sistema durante las primeras semanas
2. Recogida de feedback de usuarios
3. Ajustes de configuración según necesidades
4. Resolución de incidencias

## Documentación Técnica

### 1. Arquitectura

#### Visión General

La aplicación sigue una arquitectura de tres capas:

1. **Capa de Presentación**: Frontend SAPUI5/Fiori
2. **Capa de Negocio**: Servicios OData y lógica ABAP
3. **Capa de Datos**: Tablas de base de datos SAP

#### Diagrama de Arquitectura

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|  Frontend Fiori   |<--->|  Servicios OData  |<--->|  Base de Datos    |
|  (SAPUI5)         |     |  (SAP Gateway)    |     |  (SAP HANA/DB)    |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
        ^                         ^                         ^
        |                         |                         |
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|  Componentes UI5  |     |  Clases ABAP      |     |  Tablas Z         |
|  (MVC)            |     |  (Lógica)         |     |  (Datos)          |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
```

### 2. Modelo de Datos

#### Tablas Principales

| Tabla | Descripción | Campos Clave |
|-------|-------------|--------------|
| ZHR_EMPLOYEES | Empleados | EMPLOYEE_ID, FIRST_NAME, LAST_NAME, DEPARTMENT |
| ZHR_ABSENCE_TYPES | Tipos de ausencia | ABSENCE_TYPE_ID, DESCRIPTION, COLOR_CODE |
| ZHR_ABSENCE_REQUESTS | Solicitudes de ausencia | REQUEST_ID, EMPLOYEE_ID, START_DATE, END_DATE |
| ZHR_APPROVALS | Aprobaciones | APPROVAL_ID, REQUEST_ID, APPROVER_ID |
| ZHR_ATTACHMENTS | Documentos adjuntos | ATTACHMENT_ID, REQUEST_ID, FILE_NAME |
| ZHR_CALENDAR_CONFIG | Configuración de calendario | CONFIG_ID, YEAR, COUNTRY |
| ZHR_HOLIDAYS | Días festivos | HOLIDAY_ID, HOLIDAY_DATE, DESCRIPTION |

#### Diagrama Entidad-Relación

```
ZHR_EMPLOYEES 1---N ZHR_ABSENCE_REQUESTS N---1 ZHR_ABSENCE_TYPES
                |                |
                |                |
                |                |
                N                1
ZHR_APPROVALS N---1 EMPLOYEE    N
                                |
                                |
                                N
                        ZHR_ATTACHMENTS
```

### 3. Backend SAP

#### Servicios OData

El servicio principal `ZHR_VACATION_SRV` expone las siguientes entidades:

- Employees
- AbsenceTypes
- AbsenceRequests
- Approvals
- Attachments
- CalendarConfig
- Holidays

Y las siguientes operaciones:

- CreateAbsenceRequest
- ApproveRequest
- RejectRequest
- CancelRequest
- CalculateRemainingDays

#### Clases ABAP Principales

| Clase | Descripción | Métodos Principales |
|-------|-------------|---------------------|
| ZCL_HR_VACATION_MODEL | Gestión del modelo de datos | get_employee_data, get_absence_requests, create_absence_request |
| ZCL_HR_VACATION_CONTROLLER | Lógica de negocio | calculate_days, check_overlapping_requests, update_employee_counters |
| ZCL_HR_VACATION_SERVICE | Exposición de servicios OData | create_absence_request, approve_request, reject_request |

#### Flujos de Trabajo

**Flujo de Aprobación Estándar**:
1. Empleado crea solicitud
2. Sistema notifica al responsable
3. Responsable aprueba o rechaza
4. Sistema notifica al empleado
5. Sistema actualiza calendario y contadores

**Flujo de Aprobación Multinivel**:
1. Empleado crea solicitud
2. Sistema notifica al primer aprobador
3. Primer aprobador aprueba
4. Sistema notifica al segundo aprobador
5. Segundo aprobador aprueba o rechaza
6. Sistema notifica al empleado
7. Sistema actualiza calendario y contadores

### 4. Frontend Fiori

#### Estructura del Proyecto

```
webapp/
├── Component.js              # Componente principal
├── manifest.json             # Configuración de la aplicación
├── index.html                # Punto de entrada HTML
├── controller/               # Controladores
├── view/                     # Vistas
├── model/                    # Modelos
├── i18n/                     # Internacionalización
└── css/                      # Estilos
```

#### Componentes UI5 Principales

| Componente | Descripción | Uso |
|------------|-------------|-----|
| sap.m.PlanningCalendar | Calendario de planificación | Visualización de ausencias |
| sap.ui.layout.form.SimpleForm | Formulario simple | Formulario de solicitud |
| sap.m.Table | Tabla | Listado de solicitudes |
| sap.viz.ui5.controls.VizFrame | Marco de visualización | Gráficos de saldos |

#### Modelos de Datos

- **Modelo OData**: Conexión con el backend
- **Modelo JSON**: Datos locales y estado de la aplicación
- **Modelo de Recursos**: Textos internacionalizados

#### Flujos de Interacción

**Solicitud de Ausencia**:
1. Usuario navega a "Solicitar ausencia"
2. Completa formulario
3. Sistema valida datos
4. Usuario envía solicitud
5. Sistema confirma y actualiza vistas

**Aprobación de Solicitud**:
1. Responsable navega a "Mi equipo"
2. Visualiza solicitudes pendientes
3. Selecciona solicitud
4. Aprueba o rechaza
5. Sistema confirma y actualiza vistas

### 5. Integración

#### Comunicación Backend-Frontend

La comunicación entre el frontend y el backend se realiza a través de servicios OData:

1. **Configuración en manifest.json**:
   ```json
   "dataSources": {
     "mainService": {
       "uri": "/sap/opu/odata/sap/ZHR_VACATION_SRV/",
       "type": "OData",
       "settings": {
         "odataVersion": "2.0"
       }
     }
   }
   ```

2. **Modelos de Servicio**:
   - EmployeeService: Gestión de datos de empleados
   - AbsenceService: Gestión de ausencias y solicitudes

3. **Gestión de Autenticación**:
   - Autenticación estándar SAP
   - Verificación de roles en controladores

4. **Optimización de Rendimiento**:
   - Uso de batch requests
   - Filtrado en servidor
   - Caché de datos

### 6. Extensibilidad

#### Puntos de Extensión

La aplicación proporciona los siguientes puntos de extensión:

1. **Tipos de Ausencia**:
   - Configurables en la tabla ZHR_ABSENCE_TYPES
   - Personalización de colores y comportamiento

2. **Flujos de Aprobación**:
   - Configurables para diferentes niveles
   - Adaptables a la estructura organizativa

3. **Notificaciones**:
   - Plantillas personalizables
   - Canales configurables

#### Personalización

Para personalizar la aplicación:

1. **Textos**:
   - Modifique los archivos i18n para cambiar textos
   - Añada nuevos idiomas según necesidad

2. **Estilos**:
   - Modifique el archivo CSS para cambiar apariencia
   - Utilice temas SAP para cambios globales

3. **Comportamiento**:
   - Configure parámetros en la tabla ZHR_CALENDAR_CONFIG
   - Ajuste reglas de negocio en las clases ABAP

## Documentación de Mantenimiento

### 1. Monitorización

#### Logs del Sistema

Los logs principales se encuentran en:

1. **Logs de Backend**:
   - Transacción SLG1 con objeto ZHR_VACATION
   - Tabla de logs personalizada ZHR_LOGS

2. **Logs de Frontend**:
   - Console.log en el navegador
   - Herramientas de desarrollo del navegador

#### Alertas y Notificaciones

Configure alertas para:

1. **Errores críticos**:
   - Fallos en creación de solicitudes
   - Errores en flujos de aprobación

2. **Rendimiento**:
   - Tiempos de respuesta elevados
   - Consumo excesivo de recursos

### 2. Resolución de Problemas

#### Problemas Comunes y Soluciones

**Problema**: Error al crear solicitud de ausencia
- **Causa posible**: Solapamiento con otra ausencia
- **Solución**: Verificar ausencias existentes y fechas seleccionadas

**Problema**: No se actualizan los contadores
- **Causa posible**: Error en el cálculo de días
- **Solución**: Ejecutar recálculo manual con report ZRHR_RECALC_COUNTERS

**Problema**: Rendimiento lento en calendario
- **Causa posible**: Demasiadas ausencias cargadas
- **Solución**: Implementar filtrado adicional o paginación

#### Herramientas de Diagnóstico

1. **Transacciones SAP**:
   - ST22: Dumps ABAP
   - SLG1: Logs de aplicación
   - SMICM: Monitorización ICM

2. **Herramientas Frontend**:
   - Chrome DevTools
   - SAPUI5 Diagnostics (Ctrl+Alt+Shift+S)
   - UI5 Support Assistant

### 3. Actualizaciones

#### Procedimiento de Actualización

1. **Preparación**:
   - Backup de configuración actual
   - Verificación de compatibilidad

2. **Actualización Backend**:
   - Importación de nuevo transporte
   - Activación de objetos
   - Verificación de servicios

3. **Actualización Frontend**:
   - Despliegue de nueva versión
   - Limpieza de caché
   - Verificación de funcionalidad

4. **Pruebas Post-Actualización**:
   - Pruebas de regresión
   - Verificación de nuevas funcionalidades

#### Gestión de Versiones

La aplicación sigue el esquema de versionado semántico:

- **Mayor (X.0.0)**: Cambios incompatibles con versiones anteriores
- **Menor (0.X.0)**: Nuevas funcionalidades compatibles
- **Parche (0.0.X)**: Correcciones de errores

### 4. Backup y Recuperación

#### Estrategia de Backup

1. **Datos de Configuración**:
   - Backup regular de tablas Z
   - Exportación de configuración personalizada

2. **Código Fuente**:
   - Gestión en sistema de control de versiones
   - Backup de transportes

3. **Datos de Aplicación**:
   - Incluidos en la estrategia general de backup SAP
   - Especial atención a tablas ZHR_*

#### Procedimiento de Recuperación

1. **Recuperación de Datos**:
   - Restauración desde backup
   - Verificación de integridad

2. **Recuperación de Código**:
   - Reimportación de transportes
   - Activación de objetos

3. **Verificación Post-Recuperación**:
   - Pruebas de funcionalidad básica
   - Verificación de datos críticos

### 5. Soporte

#### Niveles de Soporte

1. **Nivel 1**: Soporte básico a usuarios
   - Problemas de acceso
   - Dudas de uso
   - Errores simples

2. **Nivel 2**: Soporte técnico
   - Problemas de configuración
   - Errores complejos
   - Ajustes de rendimiento

3. **Nivel 3**: Desarrollo
   - Corrección de bugs
   - Mejoras funcionales
   - Actualizaciones mayores

#### Contactos y Procedimientos

- **Soporte Nivel 1**: helpdesk@empresa.com / Ext. 1234
- **Soporte Nivel 2**: sap.support@empresa.com / Ext. 5678
- **Soporte Nivel 3**: sap.dev@empresa.com / Ext. 9012

Procedimiento de escalado:
1. Registro de incidencia en sistema de tickets
2. Asignación inicial a Nivel 1
3. Escalado a niveles superiores según complejidad
4. Seguimiento y cierre

### 6. Mejora Continua

#### Recogida de Feedback

1. **Encuestas a Usuarios**:
   - Encuestas trimestrales de satisfacción
   - Formularios de feedback en la aplicación

2. **Análisis de Uso**:
   - Métricas de uso de funcionalidades
   - Patrones de navegación
   - Tiempos de respuesta

#### Planificación de Mejoras

1. **Proceso de Priorización**:
   - Evaluación de impacto y esfuerzo
   - Alineación con objetivos de negocio
   - Feedback de usuarios

2. **Roadmap de Producto**:
   - Planificación trimestral de mejoras
   - Comunicación a stakeholders
   - Seguimiento de implementación

## Apéndices

### Apéndice A: Glosario de Términos

| Término | Definición |
|---------|------------|
| Ausencia | Período de tiempo en que un empleado no está disponible para trabajar |
| Solicitud | Petición formal de ausencia que requiere aprobación |
| Aprobador | Persona responsable de aprobar o rechazar solicitudes |
| Saldo | Días disponibles para un tipo de ausencia |
| Flujo de aprobación | Secuencia de pasos para aprobar una solicitud |

### Apéndice B: Referencias

- SAP Fiori Design Guidelines: https://experience.sap.com/fiori-design/
- SAPUI5 SDK: https://sapui5.hana.ondemand.com/
- SAP Gateway Documentation: https://help.sap.com/viewer/68bf513362174d54b58cddec28794093/7.52.4/en-US

### Apéndice C: Historial de Cambios

| Versión | Fecha | Descripción | Autor |
|---------|-------|-------------|-------|
| 1.0.0 | 05/04/2025 | Versión inicial | Equipo de Desarrollo |
| 1.0.1 | 10/04/2025 | Correcciones menores | Equipo de Desarrollo |
| 1.1.0 | 15/05/2025 | Nuevas funcionalidades | Equipo de Desarrollo |
