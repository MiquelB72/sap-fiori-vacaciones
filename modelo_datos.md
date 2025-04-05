# Modelo de Datos - Aplicación SAP Fiori de Gestión de Vacaciones

## Tablas Principales

### 1. Tabla de Empleados (ZHR_EMPLOYEES)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| EMPLOYEE_ID | CHAR | 10 | ID del empleado (clave primaria) |
| FIRST_NAME | STRING | 40 | Nombre del empleado |
| LAST_NAME | STRING | 40 | Apellido del empleado |
| EMAIL | STRING | 100 | Correo electrónico |
| DEPARTMENT | STRING | 50 | Departamento |
| POSITION | STRING | 50 | Puesto de trabajo |
| MANAGER_ID | CHAR | 10 | ID del responsable (referencia a EMPLOYEE_ID) |
| HIRE_DATE | DATE | - | Fecha de contratación |
| TOTAL_VACATION_DAYS | INT | 4 | Días totales de vacaciones anuales |
| REMAINING_VACATION_DAYS | INT | 4 | Días de vacaciones restantes |
| USED_VACATION_DAYS | INT | 4 | Días de vacaciones utilizados |
| PENDING_VACATION_DAYS | INT | 4 | Días de vacaciones pendientes de aprobación |
| STATUS | CHAR | 1 | Estado del empleado (A=Activo, I=Inactivo) |

### 2. Tabla de Tipos de Ausencias (ZHR_ABSENCE_TYPES)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| ABSENCE_TYPE_ID | CHAR | 4 | ID del tipo de ausencia (clave primaria) |
| DESCRIPTION | STRING | 50 | Descripción del tipo de ausencia |
| COLOR_CODE | STRING | 7 | Código de color para visualización (formato #RRGGBB) |
| REQUIRES_APPROVAL | BOOLEAN | 1 | Indica si requiere aprobación |
| REQUIRES_ATTACHMENT | BOOLEAN | 1 | Indica si requiere documento justificante |
| DEDUCT_FROM_QUOTA | BOOLEAN | 1 | Indica si se descuenta del saldo de vacaciones |
| MAX_DAYS_PER_REQUEST | INT | 4 | Máximo de días por solicitud (0 = sin límite) |
| STATUS | CHAR | 1 | Estado (A=Activo, I=Inactivo) |

### 3. Tabla de Solicitudes de Ausencia (ZHR_ABSENCE_REQUESTS)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| REQUEST_ID | CHAR | 10 | ID de la solicitud (clave primaria) |
| EMPLOYEE_ID | CHAR | 10 | ID del empleado solicitante |
| ABSENCE_TYPE_ID | CHAR | 4 | Tipo de ausencia |
| START_DATE | DATE | - | Fecha de inicio |
| END_DATE | DATE | - | Fecha de fin |
| TOTAL_DAYS | DECIMAL | 5,1 | Total de días (permite medios días) |
| COMMENTS | STRING | 255 | Comentarios del solicitante |
| STATUS | CHAR | 2 | Estado (PE=Pendiente, AP=Aprobada, RE=Rechazada, CA=Cancelada) |
| CREATED_BY | CHAR | 10 | Usuario que creó la solicitud |
| CREATED_AT | TIMESTAMP | - | Fecha y hora de creación |
| MODIFIED_BY | CHAR | 10 | Usuario que modificó por última vez |
| MODIFIED_AT | TIMESTAMP | - | Fecha y hora de última modificación |

### 4. Tabla de Aprobaciones (ZHR_APPROVALS)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| APPROVAL_ID | CHAR | 10 | ID de aprobación (clave primaria) |
| REQUEST_ID | CHAR | 10 | ID de la solicitud de ausencia |
| APPROVER_ID | CHAR | 10 | ID del aprobador |
| APPROVAL_LEVEL | INT | 2 | Nivel de aprobación (para múltiples niveles) |
| STATUS | CHAR | 2 | Estado (PE=Pendiente, AP=Aprobada, RE=Rechazada) |
| COMMENTS | STRING | 255 | Comentarios del aprobador |
| CREATED_AT | TIMESTAMP | - | Fecha y hora de creación |
| MODIFIED_AT | TIMESTAMP | - | Fecha y hora de modificación |

### 5. Tabla de Documentos Adjuntos (ZHR_ATTACHMENTS)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| ATTACHMENT_ID | CHAR | 10 | ID del documento (clave primaria) |
| REQUEST_ID | CHAR | 10 | ID de la solicitud relacionada |
| FILE_NAME | STRING | 100 | Nombre del archivo |
| FILE_TYPE | STRING | 10 | Tipo de archivo (PDF, JPG, etc.) |
| FILE_SIZE | INT | 10 | Tamaño del archivo en bytes |
| CONTENT | BLOB | - | Contenido del archivo |
| UPLOADED_BY | CHAR | 10 | Usuario que subió el archivo |
| UPLOADED_AT | TIMESTAMP | - | Fecha y hora de subida |

### 6. Tabla de Configuración de Calendario (ZHR_CALENDAR_CONFIG)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| CONFIG_ID | CHAR | 10 | ID de configuración (clave primaria) |
| COMPANY_ID | CHAR | 4 | ID de la empresa |
| YEAR | CHAR | 4 | Año de configuración |
| COUNTRY | CHAR | 2 | Código de país |
| WORKING_DAYS | STRING | 7 | Días laborables (formato: 1111100 para L-V) |
| DEFAULT_WORKING_HOURS | DECIMAL | 4,1 | Horas laborables por defecto |
| STATUS | CHAR | 1 | Estado (A=Activo, I=Inactivo) |

### 7. Tabla de Días Festivos (ZHR_HOLIDAYS)
| Campo | Tipo | Longitud | Descripción |
|-------|------|----------|-------------|
| HOLIDAY_ID | CHAR | 10 | ID del día festivo (clave primaria) |
| HOLIDAY_DATE | DATE | - | Fecha del día festivo |
| DESCRIPTION | STRING | 100 | Descripción del día festivo |
| COUNTRY | CHAR | 2 | Código de país |
| REGION | CHAR | 3 | Código de región (opcional) |
| RECURRING | BOOLEAN | 1 | Indica si es recurrente cada año |
| STATUS | CHAR | 1 | Estado (A=Activo, I=Inactivo) |

## Relaciones entre Tablas

1. **Empleados y Solicitudes**:
   - Un empleado puede tener múltiples solicitudes de ausencia
   - Relación 1:N entre ZHR_EMPLOYEES y ZHR_ABSENCE_REQUESTS

2. **Tipos de Ausencia y Solicitudes**:
   - Un tipo de ausencia puede estar en múltiples solicitudes
   - Relación 1:N entre ZHR_ABSENCE_TYPES y ZHR_ABSENCE_REQUESTS

3. **Solicitudes y Aprobaciones**:
   - Una solicitud puede tener múltiples aprobaciones (para flujos con múltiples aprobadores)
   - Relación 1:N entre ZHR_ABSENCE_REQUESTS y ZHR_APPROVALS

4. **Solicitudes y Documentos**:
   - Una solicitud puede tener múltiples documentos adjuntos
   - Relación 1:N entre ZHR_ABSENCE_REQUESTS y ZHR_ATTACHMENTS

5. **Empleados y Aprobaciones**:
   - Un empleado puede ser aprobador de múltiples solicitudes
   - Relación 1:N entre ZHR_EMPLOYEES y ZHR_APPROVALS

## Diagrama Entidad-Relación

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

## Valores Iniciales para Tipos de Ausencia

| ABSENCE_TYPE_ID | DESCRIPTION | COLOR_CODE | REQUIRES_APPROVAL | REQUIRES_ATTACHMENT | DEDUCT_FROM_QUOTA |
|-----------------|-------------|------------|-------------------|---------------------|-------------------|
| VAC | Vacaciones | #4CAF50 | true | false | true |
| MUD | Mudanza | #FFC107 | true | false | false |
| BAJ | Baja (enfermedad) | #F44336 | true | true | false |
| SOB | Sobre tiempo | #2196F3 | true | false | false |
| CON | Convenio Consultoría | #9C27B0 | true | false | false |
| CIU | Ciudad Real | #795548 | true | false | false |
