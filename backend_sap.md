# Desarrollo Backend SAP - Aplicación Fiori de Gestión de Vacaciones

## Servicios OData

### 1. Servicio Principal: ZHR_VACATION_SRV

#### Entidades Expuestas:

1. **Employees**
   - Entidad para gestionar información de empleados
   - Campos principales: ID, nombre, apellido, departamento, días disponibles
   - Navegación a: AbsenceRequests, Approvals

2. **AbsenceTypes**
   - Entidad para tipos de ausencias configurados
   - Campos principales: ID, descripción, color, configuración
   - Navegación a: AbsenceRequests

3. **AbsenceRequests**
   - Entidad principal para solicitudes de ausencia
   - Campos principales: ID, empleado, tipo, fechas, estado
   - Navegación a: Approvals, Attachments

4. **Approvals**
   - Entidad para gestionar aprobaciones
   - Campos principales: ID, solicitud, aprobador, estado, comentarios
   - Navegación a: AbsenceRequests, Employees

5. **Attachments**
   - Entidad para documentos adjuntos
   - Campos principales: ID, solicitud, nombre archivo, contenido
   - Navegación a: AbsenceRequests

6. **CalendarConfig**
   - Entidad para configuración de calendario
   - Campos principales: ID, año, país, días laborables

7. **Holidays**
   - Entidad para días festivos
   - Campos principales: ID, fecha, descripción, país

#### Operaciones Principales:

1. **CreateAbsenceRequest**
   - Función: Crear nueva solicitud de ausencia
   - Parámetros: Tipo, fechas, comentarios
   - Retorno: ID de solicitud creada, estado

2. **ApproveRequest**
   - Función: Aprobar solicitud de ausencia
   - Parámetros: ID solicitud, comentarios
   - Retorno: Estado actualizado

3. **RejectRequest**
   - Función: Rechazar solicitud de ausencia
   - Parámetros: ID solicitud, motivo rechazo
   - Retorno: Estado actualizado

4. **CancelRequest**
   - Función: Cancelar solicitud de ausencia
   - Parámetros: ID solicitud, motivo cancelación
   - Retorno: Estado actualizado

5. **CalculateRemainingDays**
   - Función: Calcular días disponibles
   - Parámetros: ID empleado, año
   - Retorno: Días totales, usados, pendientes, disponibles

## Implementación ABAP

### Clases Principales

1. **ZCL_HR_VACATION_MODEL**
   - Clase para gestión del modelo de datos
   - Métodos para CRUD de entidades principales

2. **ZCL_HR_VACATION_CONTROLLER**
   - Clase controladora para lógica de negocio
   - Implementación de flujos de trabajo y validaciones

3. **ZCL_HR_VACATION_SERVICE**
   - Clase para exposición de servicios OData
   - Implementación de operaciones y mapeo de entidades

### Código ABAP para Entidades Principales

```abap
*&---------------------------------------------------------------------*
*& Clase ZCL_HR_VACATION_MODEL
*&---------------------------------------------------------------------*
CLASS zcl_hr_vacation_model DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.
    METHODS:
      get_employee_data
        IMPORTING
          iv_employee_id TYPE zhr_employees-employee_id
        RETURNING
          VALUE(rs_employee) TYPE zhr_employees,
          
      get_absence_requests
        IMPORTING
          iv_employee_id TYPE zhr_employees-employee_id OPTIONAL
          iv_status      TYPE zhr_absence_requests-status OPTIONAL
        RETURNING
          VALUE(rt_requests) TYPE TABLE OF zhr_absence_requests,
          
      create_absence_request
        IMPORTING
          is_request     TYPE zhr_absence_requests
        RETURNING
          VALUE(rv_request_id) TYPE zhr_absence_requests-request_id,
          
      update_request_status
        IMPORTING
          iv_request_id  TYPE zhr_absence_requests-request_id
          iv_status      TYPE zhr_absence_requests-status
          iv_comments    TYPE zhr_approvals-comments OPTIONAL
          iv_approver_id TYPE zhr_approvals-approver_id
        RETURNING
          VALUE(rv_success) TYPE abap_bool,
          
      calculate_days
        IMPORTING
          iv_employee_id TYPE zhr_employees-employee_id
          iv_year        TYPE numc4
        RETURNING
          VALUE(rs_days) TYPE zhr_vacation_days.
          
  PRIVATE SECTION.
    METHODS:
      check_overlapping_requests
        IMPORTING
          is_request     TYPE zhr_absence_requests
        RETURNING
          VALUE(rv_overlapping) TYPE abap_bool,
          
      update_employee_counters
        IMPORTING
          iv_employee_id TYPE zhr_employees-employee_id
        RETURNING
          VALUE(rv_success) TYPE abap_bool.
ENDCLASS.

CLASS zcl_hr_vacation_model IMPLEMENTATION.
  METHOD get_employee_data.
    SELECT SINGLE *
      FROM zhr_employees
      INTO rs_employee
      WHERE employee_id = iv_employee_id.
  ENDMETHOD.
  
  METHOD get_absence_requests.
    DATA: lv_where TYPE string.
    
    IF iv_employee_id IS NOT INITIAL.
      lv_where = |employee_id = '{ iv_employee_id }'|.
    ENDIF.
    
    IF iv_status IS NOT INITIAL.
      IF lv_where IS NOT INITIAL.
        lv_where = |{ lv_where } AND |.
      ENDIF.
      lv_where = |{ lv_where } status = '{ iv_status }'|.
    ENDIF.
    
    SELECT *
      FROM zhr_absence_requests
      INTO TABLE rt_requests
      WHERE (lv_where).
  ENDMETHOD.
  
  METHOD create_absence_request.
    DATA: ls_request TYPE zhr_absence_requests.
    
    " Generar ID de solicitud
    SELECT MAX( request_id )
      FROM zhr_absence_requests
      INTO @DATA(lv_max_id).
      
    ls_request = is_request.
    ls_request-request_id = lv_max_id + 1.
    ls_request-status = 'PE'. " Pendiente
    ls_request-created_at = sy-datum.
    ls_request-created_by = sy-uname.
    
    " Verificar solapamiento
    IF check_overlapping_requests( ls_request ) = abap_true.
      rv_request_id = '0000000000'.
      RETURN.
    ENDIF.
    
    " Insertar solicitud
    INSERT zhr_absence_requests FROM ls_request.
    IF sy-subrc = 0.
      rv_request_id = ls_request-request_id.
      
      " Actualizar contadores del empleado
      update_employee_counters( ls_request-employee_id ).
    ENDIF.
  ENDMETHOD.
  
  METHOD update_request_status.
    DATA: ls_approval TYPE zhr_approvals,
          ls_request  TYPE zhr_absence_requests.
          
    " Obtener solicitud actual
    SELECT SINGLE *
      FROM zhr_absence_requests
      INTO ls_request
      WHERE request_id = iv_request_id.
      
    IF sy-subrc <> 0.
      rv_success = abap_false.
      RETURN.
    ENDIF.
    
    " Actualizar estado de la solicitud
    UPDATE zhr_absence_requests
      SET status = iv_status
          modified_at = sy-datum
          modified_by = sy-uname
      WHERE request_id = iv_request_id.
      
    IF sy-subrc = 0.
      " Crear registro de aprobación
      SELECT MAX( approval_id )
        FROM zhr_approvals
        INTO @DATA(lv_max_id).
        
      ls_approval-approval_id = lv_max_id + 1.
      ls_approval-request_id = iv_request_id.
      ls_approval-approver_id = iv_approver_id.
      ls_approval-status = iv_status.
      ls_approval-comments = iv_comments.
      ls_approval-created_at = sy-datum.
      
      INSERT zhr_approvals FROM ls_approval.
      
      " Actualizar contadores del empleado
      update_employee_counters( ls_request-employee_id ).
      
      rv_success = abap_true.
    ELSE.
      rv_success = abap_false.
    ENDIF.
  ENDMETHOD.
  
  METHOD calculate_days.
    DATA: lv_total_days TYPE i,
          lv_used_days  TYPE i,
          lv_pending_days TYPE i.
          
    " Obtener datos del empleado
    SELECT SINGLE total_vacation_days
      FROM zhr_employees
      INTO lv_total_days
      WHERE employee_id = iv_employee_id.
      
    " Calcular días usados (solicitudes aprobadas)
    SELECT SUM( total_days )
      FROM zhr_absence_requests
      INTO lv_used_days
      WHERE employee_id = iv_employee_id
        AND absence_type_id = 'VAC'  " Solo vacaciones
        AND status = 'AP'            " Aprobadas
        AND SUBSTRING( start_date, 1, 4 ) = iv_year.
        
    " Calcular días pendientes (solicitudes en proceso)
    SELECT SUM( total_days )
      FROM zhr_absence_requests
      INTO lv_pending_days
      WHERE employee_id = iv_employee_id
        AND absence_type_id = 'VAC'  " Solo vacaciones
        AND status = 'PE'            " Pendientes
        AND SUBSTRING( start_date, 1, 4 ) = iv_year.
        
    " Calcular días disponibles
    rs_days-total_days = lv_total_days.
    rs_days-used_days = lv_used_days.
    rs_days-pending_days = lv_pending_days.
    rs_days-available_days = lv_total_days - lv_used_days - lv_pending_days.
  ENDMETHOD.
  
  METHOD check_overlapping_requests.
    DATA: lt_existing_requests TYPE TABLE OF zhr_absence_requests.
    
    " Buscar solicitudes existentes que se solapen
    SELECT *
      FROM zhr_absence_requests
      INTO TABLE lt_existing_requests
      WHERE employee_id = is_request-employee_id
        AND status IN ('PE', 'AP')  " Pendientes o aprobadas
        AND ( ( start_date <= is_request-end_date AND end_date >= is_request-start_date )
              OR ( start_date >= is_request-start_date AND start_date <= is_request-end_date )
              OR ( end_date >= is_request-start_date AND end_date <= is_request-end_date ) ).
              
    IF lines( lt_existing_requests ) > 0.
      rv_overlapping = abap_true.
    ELSE.
      rv_overlapping = abap_false.
    ENDIF.
  ENDMETHOD.
  
  METHOD update_employee_counters.
    DATA: ls_days TYPE zhr_vacation_days,
          ls_employee TYPE zhr_employees.
          
    " Calcular días actualizados
    ls_days = calculate_days(
                iv_employee_id = iv_employee_id
                iv_year = SUBSTRING( sy-datum, 1, 4 ) ).
                
    " Actualizar contadores del empleado
    UPDATE zhr_employees
      SET remaining_vacation_days = ls_days-available_days
          used_vacation_days = ls_days-used_days
          pending_vacation_days = ls_days-pending_days
      WHERE employee_id = iv_employee_id.
      
    IF sy-subrc = 0.
      rv_success = abap_true.
    ELSE.
      rv_success = abap_false.
    ENDIF.
  ENDMETHOD.
ENDCLASS.
```

### Implementación del Servicio OData

```abap
*&---------------------------------------------------------------------*
*& Clase ZCL_HR_VACATION_SERVICE
*&---------------------------------------------------------------------*
CLASS zcl_hr_vacation_service DEFINITION
  PUBLIC
  INHERITING FROM /iwbep/cl_mgw_push_abs_model
  CREATE PUBLIC .

  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_vacation_days,
        total_days     TYPE i,
        used_days      TYPE i,
        pending_days   TYPE i,
        available_days TYPE i,
      END OF ty_vacation_days.

    METHODS:
      constructor,
      
      /iwbep/if_mgw_appl_srv_runtime~create_entity
        REDEFINITION,
        
      /iwbep/if_mgw_appl_srv_runtime~get_entity
        REDEFINITION,
        
      /iwbep/if_mgw_appl_srv_runtime~get_entityset
        REDEFINITION,
        
      /iwbep/if_mgw_appl_srv_runtime~update_entity
        REDEFINITION.
        
  PROTECTED SECTION.
    DATA:
      mo_model TYPE REF TO zcl_hr_vacation_model.
      
    METHODS:
      create_absence_request
        IMPORTING
          io_data_provider TYPE REF TO /iwbep/if_mgw_entry_provider
          io_response      TYPE REF TO /iwbep/if_mgw_response
        RAISING
          /iwbep/cx_mgw_busi_exception,
          
      approve_request
        IMPORTING
          iv_request_id    TYPE zhr_absence_requests-request_id
          iv_approver_id   TYPE zhr_approvals-approver_id
          iv_comments      TYPE zhr_approvals-comments
        RETURNING
          VALUE(rv_success) TYPE abap_bool,
          
      reject_request
        IMPORTING
          iv_request_id    TYPE zhr_absence_requests-request_id
          iv_approver_id   TYPE zhr_approvals-approver_id
          iv_comments      TYPE zhr_approvals-comments
        RETURNING
          VALUE(rv_success) TYPE abap_bool,
          
      cancel_request
        IMPORTING
          iv_request_id    TYPE zhr_absence_requests-request_id
          iv_employee_id   TYPE zhr_employees-employee_id
          iv_comments      TYPE zhr_approvals-comments
        RETURNING
          VALUE(rv_success) TYPE abap_bool.
          
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_hr_vacation_service IMPLEMENTATION.
  METHOD constructor.
    super->constructor( ).
    CREATE OBJECT mo_model.
  ENDMETHOD.
  
  METHOD /iwbep/if_mgw_appl_srv_runtime~create_entity.
    DATA: lv_entity_name TYPE string.
    
    lv_entity_name = io_tech_request_context->get_entity_type_name( ).
    
    CASE lv_entity_name.
      WHEN 'AbsenceRequest'.
        create_absence_request(
          io_data_provider = io_data_provider
          io_response      = io_response ).
          
      WHEN OTHERS.
        super->/iwbep/if_mgw_appl_srv_runtime~create_entity(
          io_data_provider = io_data_provider
          io_response      = io_response ).
    ENDCASE.
  ENDMETHOD.
  
  METHOD create_absence_request.
    DATA: ls_request TYPE zhr_absence_requests,
          ls_entity  TYPE zcl_zhr_vacation_mpc=>ts_absencerequest.
          
    " Leer datos de la solicitud
    io_data_provider->read_entry_data( IMPORTING es_data = ls_entity ).
    
    " Mapear a estructura de base de datos
    MOVE-CORRESPONDING ls_entity TO ls_request.
    
    " Crear solicitud
    DATA(lv_request_id) = mo_model->create_absence_request( ls_request ).
    
    IF lv_request_id IS NOT INITIAL AND lv_request_id <> '0000000000'.
      " Leer solicitud creada
      SELECT SINGLE *
        FROM zhr_absence_requests
        INTO ls_request
        WHERE request_id = lv_request_id.
        
      " Mapear a estructura de entidad
      MOVE-CORRESPONDING ls_request TO ls_entity.
      
      " Devolver entidad creada
      copy_data_to_ref(
        EXPORTING
          is_data = ls_entity
        CHANGING
          cr_data = er_entity ).
    ELSE.
      RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
        EXPORTING
          textid = /iwbep/cx_mgw_busi_exception=>business_error
          message = 'Error al crear la solicitud de ausencia'.
    ENDIF.
  ENDMETHOD.
  
  METHOD approve_request.
    rv_success = mo_model->update_request_status(
                   iv_request_id  = iv_request_id
                   iv_status      = 'AP'  " Aprobada
                   iv_comments    = iv_comments
                   iv_approver_id = iv_approver_id ).
  ENDMETHOD.
  
  METHOD reject_request.
    rv_success = mo_model->update_request_status(
                   iv_request_id  = iv_request_id
                   iv_status      = 'RE'  " Rechazada
                   iv_comments    = iv_comments
                   iv_approver_id = iv_approver_id ).
  ENDMETHOD.
  
  METHOD cancel_request.
    rv_success = mo_model->update_request_status(
                   iv_request_id  = iv_request_id
                   iv_status      = 'CA'  " Cancelada
                   iv_comments    = iv_comments
                   iv_approver_id = iv_employee_id ).
  ENDMETHOD.
  
  METHOD /iwbep/if_mgw_appl_srv_runtime~get_entity.
    " Implementación para obtener una entidad específica
    " (código omitido por brevedad)
    super->/iwbep/if_mgw_appl_srv_runtime~get_entity(
      io_tech_request_context = io_tech_request_context
      io_response             = io_response ).
  ENDMETHOD.
  
  METHOD /iwbep/if_mgw_appl_srv_runtime~get_entityset.
    " Implementación para obtener conjunto de entidades
    " (código omitido por brevedad)
    super->/iwbep/if_mgw_appl_srv_runtime~get_entityset(
      io_tech_request_context = io_tech_request_context
      io_response             = io_response ).
  ENDMETHOD.
  
  METHOD /iwbep/if_mgw_appl_srv_runtime~update_entity.
    " Implementación para actualizar una entidad
    " (código omitido por brevedad)
    super->/iwbep/if_mgw_appl_srv_runtime~update_entity(
      io_data_provider        = io_data_provider
      io_response             = io_response
      io_tech_request_context = io_tech_request_context ).
  ENDMETHOD.
ENDCLASS.
```

## Configuración de Autorizaciones

### Roles y Permisos

1. **ZHR_VACATION_EMPLOYEE**
   - Rol para empleados estándar
   - Permisos:
     - Visualizar calendario propio
     - Crear solicitudes propias
     - Cancelar solicitudes propias pendientes
     - Ver histórico propio

2. **ZHR_VACATION_MANAGER**
   - Rol para responsables/supervisores
   - Permisos:
     - Todo lo del rol de empleado
     - Visualizar calendario de equipo
     - Aprobar/rechazar solicitudes de su equipo
     - Ver histórico de su equipo

3. **ZHR_VACATION_ADMIN**
   - Rol para administradores
   - Permisos:
     - Acceso completo a todas las funcionalidades
     - Configuración de tipos de ausencia
     - Gestión de días festivos
     - Reportes y estadísticas

### Objetos de Autorización

```abap
*&---------------------------------------------------------------------*
*& Objetos de Autorización para Gestión de Vacaciones
*&---------------------------------------------------------------------*

" Objeto para acceso a solicitudes
DEFINE ZHR_VAC_REQ.
  ACTIVITY     : 01=Crear, 02=Modificar, 03=Visualizar, 06=Eliminar
  EMPLOYEE_GRP : Grupo de empleados (propio, equipo, todos)
  REQ_TYPE     : Tipo de solicitud (VAC, MUD, BAJ, etc.)
END-DEFINE.

" Objeto para acceso a configuración
DEFINE ZHR_VAC_CONFIG.
  ACTIVITY     : 01=Crear, 02=Modificar, 03=Visualizar, 06=Eliminar
  CONFIG_TYPE  : Tipo de configuración (tipos ausencia, festivos, etc.)
END-DEFINE.
```

## Flujos de Trabajo (Workflow)

### Flujo de Aprobación Estándar

1. Empleado crea solicitud de ausencia
2. Sistema notifica al responsable
3. Responsable aprueba o rechaza
4. Sistema notifica al empleado
5. Sistema actualiza calendario y contadores

### Flujo de Aprobación Multinivel

1. Empleado crea solicitud de ausencia
2. Sistema notifica al primer aprobador (responsable directo)
3. Primer aprobador aprueba
4. Sistema notifica al segundo aprobador (nivel superior)
5. Segundo aprobador aprueba o rechaza
6. Sistema notifica al empleado
7. Sistema actualiza calendario y contadores

## Integración con Otros Sistemas

### SAP HCM / SuccessFactors
- Sincronización de datos de empleados
- Sincronización de jerarquía organizativa
- Actualización de saldos de vacaciones

### Sistemas de Calendario
- Exportación a Outlook, Google Calendar, etc.
- Sincronización bidireccional de eventos

## Configuración de Mensajes y Notificaciones

### Plantillas de Correo Electrónico

1. **Solicitud Creada**
   - Asunto: Nueva solicitud de ausencia pendiente de aprobación
   - Destinatario: Responsable/Aprobador
   - Contenido: Detalles de la solicitud, enlace para aprobar/rechazar

2. **Solicitud Aprobada**
   - Asunto: Solicitud de ausencia aprobada
   - Destinatario: Empleado solicitante
   - Contenido: Confirmación, detalles, saldo actualizado

3. **Solicitud Rechazada**
   - Asunto: Solicitud de ausencia rechazada
   - Destinatario: Empleado solicitante
   - Contenido: Motivo de rechazo, detalles, opciones para nueva solicitud

4. **Recordatorio Pendiente**
   - Asunto: Recordatorio: Solicitudes pendientes de aprobación
   - Destinatario: Responsable/Aprobador
   - Contenido: Lista de solicitudes pendientes, enlaces para acción
