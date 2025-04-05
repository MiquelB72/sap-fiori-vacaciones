# Integración Backend-Frontend - Aplicación SAP Fiori de Gestión de Vacaciones

## Introducción

Este documento detalla el proceso de integración entre el backend SAP y el frontend Fiori para la aplicación de gestión de vacaciones. La integración se realiza principalmente a través de servicios OData, que permiten la comunicación entre la interfaz de usuario y la lógica de negocio implementada en el backend.

## Configuración de Conexión OData

### 1. Configuración en el Manifest.json

El archivo manifest.json debe configurarse correctamente para establecer la conexión con el servicio OData del backend:

```json
{
  "sap.app": {
    "id": "com.vacaciones.app",
    "type": "application",
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "applicationVersion": {
      "version": "1.0.0"
    },
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZHR_VACATION_SRV/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0",
          "localUri": "localService/metadata.xml"
        }
      }
    }
  },
  "sap.ui5": {
    "models": {
      "": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {
          "defaultBindingMode": "TwoWay",
          "defaultCountMode": "Inline",
          "refreshAfterChange": true,
          "useBatch": true
        }
      },
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "com.vacaciones.app.i18n.i18n"
        }
      }
    }
  }
}
```

### 2. Archivo de Metadatos Local

Para desarrollo y pruebas, es útil tener una copia local de los metadatos del servicio OData:

```xml
<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
  <edmx:DataServices m:DataServiceVersion="1.0" m:MaxDataServiceVersion="3.0" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
    <Schema Namespace="ZHR_VACATION_SRV" xmlns="http://schemas.microsoft.com/ado/2008/09/edm">
      <EntityType Name="Employee">
        <Key>
          <PropertyRef Name="EmployeeId" />
        </Key>
        <Property Name="EmployeeId" Type="Edm.String" Nullable="false" MaxLength="10" />
        <Property Name="FirstName" Type="Edm.String" MaxLength="40" />
        <Property Name="LastName" Type="Edm.String" MaxLength="40" />
        <Property Name="Email" Type="Edm.String" MaxLength="100" />
        <Property Name="Department" Type="Edm.String" MaxLength="50" />
        <Property Name="Position" Type="Edm.String" MaxLength="50" />
        <Property Name="ManagerId" Type="Edm.String" MaxLength="10" />
        <Property Name="HireDate" Type="Edm.DateTime" />
        <Property Name="TotalVacationDays" Type="Edm.Int32" />
        <Property Name="RemainingVacationDays" Type="Edm.Int32" />
        <Property Name="UsedVacationDays" Type="Edm.Int32" />
        <Property Name="PendingVacationDays" Type="Edm.Int32" />
        <Property Name="Status" Type="Edm.String" MaxLength="1" />
        <NavigationProperty Name="AbsenceRequests" Relationship="ZHR_VACATION_SRV.EmployeeToAbsenceRequests" FromRole="Employee" ToRole="AbsenceRequest" />
        <NavigationProperty Name="Approvals" Relationship="ZHR_VACATION_SRV.EmployeeToApprovals" FromRole="Employee" ToRole="Approval" />
      </EntityType>
      
      <EntityType Name="AbsenceType">
        <Key>
          <PropertyRef Name="AbsenceTypeId" />
        </Key>
        <Property Name="AbsenceTypeId" Type="Edm.String" Nullable="false" MaxLength="4" />
        <Property Name="Description" Type="Edm.String" MaxLength="50" />
        <Property Name="ColorCode" Type="Edm.String" MaxLength="7" />
        <Property Name="RequiresApproval" Type="Edm.Boolean" />
        <Property Name="RequiresAttachment" Type="Edm.Boolean" />
        <Property Name="DeductFromQuota" Type="Edm.Boolean" />
        <Property Name="MaxDaysPerRequest" Type="Edm.Int32" />
        <Property Name="Status" Type="Edm.String" MaxLength="1" />
        <NavigationProperty Name="AbsenceRequests" Relationship="ZHR_VACATION_SRV.AbsenceTypeToAbsenceRequests" FromRole="AbsenceType" ToRole="AbsenceRequest" />
      </EntityType>
      
      <EntityType Name="AbsenceRequest">
        <Key>
          <PropertyRef Name="RequestId" />
        </Key>
        <Property Name="RequestId" Type="Edm.String" Nullable="false" MaxLength="10" />
        <Property Name="EmployeeId" Type="Edm.String" MaxLength="10" />
        <Property Name="AbsenceTypeId" Type="Edm.String" MaxLength="4" />
        <Property Name="StartDate" Type="Edm.DateTime" />
        <Property Name="EndDate" Type="Edm.DateTime" />
        <Property Name="TotalDays" Type="Edm.Decimal" Precision="5" Scale="1" />
        <Property Name="Comments" Type="Edm.String" MaxLength="255" />
        <Property Name="Status" Type="Edm.String" MaxLength="2" />
        <Property Name="CreatedBy" Type="Edm.String" MaxLength="10" />
        <Property Name="CreatedAt" Type="Edm.DateTime" />
        <Property Name="ModifiedBy" Type="Edm.String" MaxLength="10" />
        <Property Name="ModifiedAt" Type="Edm.DateTime" />
        <NavigationProperty Name="Employee" Relationship="ZHR_VACATION_SRV.EmployeeToAbsenceRequests" FromRole="AbsenceRequest" ToRole="Employee" />
        <NavigationProperty Name="AbsenceType" Relationship="ZHR_VACATION_SRV.AbsenceTypeToAbsenceRequests" FromRole="AbsenceRequest" ToRole="AbsenceType" />
        <NavigationProperty Name="Approvals" Relationship="ZHR_VACATION_SRV.AbsenceRequestToApprovals" FromRole="AbsenceRequest" ToRole="Approval" />
        <NavigationProperty Name="Attachments" Relationship="ZHR_VACATION_SRV.AbsenceRequestToAttachments" FromRole="AbsenceRequest" ToRole="Attachment" />
      </EntityType>
      
      <EntityType Name="Approval">
        <Key>
          <PropertyRef Name="ApprovalId" />
        </Key>
        <Property Name="ApprovalId" Type="Edm.String" Nullable="false" MaxLength="10" />
        <Property Name="RequestId" Type="Edm.String" MaxLength="10" />
        <Property Name="ApproverId" Type="Edm.String" MaxLength="10" />
        <Property Name="ApprovalLevel" Type="Edm.Int32" />
        <Property Name="Status" Type="Edm.String" MaxLength="2" />
        <Property Name="Comments" Type="Edm.String" MaxLength="255" />
        <Property Name="CreatedAt" Type="Edm.DateTime" />
        <Property Name="ModifiedAt" Type="Edm.DateTime" />
        <NavigationProperty Name="AbsenceRequest" Relationship="ZHR_VACATION_SRV.AbsenceRequestToApprovals" FromRole="Approval" ToRole="AbsenceRequest" />
        <NavigationProperty Name="Approver" Relationship="ZHR_VACATION_SRV.EmployeeToApprovals" FromRole="Approval" ToRole="Employee" />
      </EntityType>
      
      <EntityType Name="Attachment">
        <Key>
          <PropertyRef Name="AttachmentId" />
        </Key>
        <Property Name="AttachmentId" Type="Edm.String" Nullable="false" MaxLength="10" />
        <Property Name="RequestId" Type="Edm.String" MaxLength="10" />
        <Property Name="FileName" Type="Edm.String" MaxLength="100" />
        <Property Name="FileType" Type="Edm.String" MaxLength="10" />
        <Property Name="FileSize" Type="Edm.Int32" />
        <Property Name="Content" Type="Edm.Binary" />
        <Property Name="UploadedBy" Type="Edm.String" MaxLength="10" />
        <Property Name="UploadedAt" Type="Edm.DateTime" />
        <NavigationProperty Name="AbsenceRequest" Relationship="ZHR_VACATION_SRV.AbsenceRequestToAttachments" FromRole="Attachment" ToRole="AbsenceRequest" />
      </EntityType>
      
      <!-- Relaciones -->
      <Association Name="EmployeeToAbsenceRequests">
        <End Type="ZHR_VACATION_SRV.Employee" Multiplicity="0..1" Role="Employee" />
        <End Type="ZHR_VACATION_SRV.AbsenceRequest" Multiplicity="*" Role="AbsenceRequest" />
        <ReferentialConstraint>
          <Principal Role="Employee">
            <PropertyRef Name="EmployeeId" />
          </Principal>
          <Dependent Role="AbsenceRequest">
            <PropertyRef Name="EmployeeId" />
          </Dependent>
        </ReferentialConstraint>
      </Association>
      
      <Association Name="AbsenceTypeToAbsenceRequests">
        <End Type="ZHR_VACATION_SRV.AbsenceType" Multiplicity="0..1" Role="AbsenceType" />
        <End Type="ZHR_VACATION_SRV.AbsenceRequest" Multiplicity="*" Role="AbsenceRequest" />
        <ReferentialConstraint>
          <Principal Role="AbsenceType">
            <PropertyRef Name="AbsenceTypeId" />
          </Principal>
          <Dependent Role="AbsenceRequest">
            <PropertyRef Name="AbsenceTypeId" />
          </Dependent>
        </ReferentialConstraint>
      </Association>
      
      <Association Name="AbsenceRequestToApprovals">
        <End Type="ZHR_VACATION_SRV.AbsenceRequest" Multiplicity="0..1" Role="AbsenceRequest" />
        <End Type="ZHR_VACATION_SRV.Approval" Multiplicity="*" Role="Approval" />
        <ReferentialConstraint>
          <Principal Role="AbsenceRequest">
            <PropertyRef Name="RequestId" />
          </Principal>
          <Dependent Role="Approval">
            <PropertyRef Name="RequestId" />
          </Dependent>
        </ReferentialConstraint>
      </Association>
      
      <Association Name="EmployeeToApprovals">
        <End Type="ZHR_VACATION_SRV.Employee" Multiplicity="0..1" Role="Employee" />
        <End Type="ZHR_VACATION_SRV.Approval" Multiplicity="*" Role="Approval" />
        <ReferentialConstraint>
          <Principal Role="Employee">
            <PropertyRef Name="EmployeeId" />
          </Principal>
          <Dependent Role="Approval">
            <PropertyRef Name="ApproverId" />
          </Dependent>
        </ReferentialConstraint>
      </Association>
      
      <Association Name="AbsenceRequestToAttachments">
        <End Type="ZHR_VACATION_SRV.AbsenceRequest" Multiplicity="0..1" Role="AbsenceRequest" />
        <End Type="ZHR_VACATION_SRV.Attachment" Multiplicity="*" Role="Attachment" />
        <ReferentialConstraint>
          <Principal Role="AbsenceRequest">
            <PropertyRef Name="RequestId" />
          </Principal>
          <Dependent Role="Attachment">
            <PropertyRef Name="RequestId" />
          </Dependent>
        </ReferentialConstraint>
      </Association>
      
      <!-- Conjunto de Entidades -->
      <EntityContainer Name="ZHR_VACATION_SRV_Entities" m:IsDefaultEntityContainer="true">
        <EntitySet Name="Employees" EntityType="ZHR_VACATION_SRV.Employee" />
        <EntitySet Name="AbsenceTypes" EntityType="ZHR_VACATION_SRV.AbsenceType" />
        <EntitySet Name="AbsenceRequests" EntityType="ZHR_VACATION_SRV.AbsenceRequest" />
        <EntitySet Name="Approvals" EntityType="ZHR_VACATION_SRV.Approval" />
        <EntitySet Name="Attachments" EntityType="ZHR_VACATION_SRV.Attachment" />
        
        <AssociationSet Name="EmployeeToAbsenceRequestsSet" Association="ZHR_VACATION_SRV.EmployeeToAbsenceRequests">
          <End Role="Employee" EntitySet="Employees" />
          <End Role="AbsenceRequest" EntitySet="AbsenceRequests" />
        </AssociationSet>
        
        <AssociationSet Name="AbsenceTypeToAbsenceRequestsSet" Association="ZHR_VACATION_SRV.AbsenceTypeToAbsenceRequests">
          <End Role="AbsenceType" EntitySet="AbsenceTypes" />
          <End Role="AbsenceRequest" EntitySet="AbsenceRequests" />
        </AssociationSet>
        
        <AssociationSet Name="AbsenceRequestToApprovalsSet" Association="ZHR_VACATION_SRV.AbsenceRequestToApprovals">
          <End Role="AbsenceRequest" EntitySet="AbsenceRequests" />
          <End Role="Approval" EntitySet="Approvals" />
        </AssociationSet>
        
        <AssociationSet Name="EmployeeToApprovalsSet" Association="ZHR_VACATION_SRV.EmployeeToApprovals">
          <End Role="Employee" EntitySet="Employees" />
          <End Role="Approval" EntitySet="Approvals" />
        </AssociationSet>
        
        <AssociationSet Name="AbsenceRequestToAttachmentsSet" Association="ZHR_VACATION_SRV.AbsenceRequestToAttachments">
          <End Role="AbsenceRequest" EntitySet="AbsenceRequests" />
          <End Role="Attachment" EntitySet="Attachments" />
        </AssociationSet>
        
        <!-- Funciones -->
        <FunctionImport Name="CreateAbsenceRequest" ReturnType="ZHR_VACATION_SRV.AbsenceRequest" EntitySet="AbsenceRequests" m:HttpMethod="POST">
          <Parameter Name="EmployeeId" Type="Edm.String" Mode="In" />
          <Parameter Name="AbsenceTypeId" Type="Edm.String" Mode="In" />
          <Parameter Name="StartDate" Type="Edm.DateTime" Mode="In" />
          <Parameter Name="EndDate" Type="Edm.DateTime" Mode="In" />
          <Parameter Name="Comments" Type="Edm.String" Mode="In" />
        </FunctionImport>
        
        <FunctionImport Name="ApproveRequest" ReturnType="Edm.Boolean" m:HttpMethod="POST">
          <Parameter Name="RequestId" Type="Edm.String" Mode="In" />
          <Parameter Name="ApproverId" Type="Edm.String" Mode="In" />
          <Parameter Name="Comments" Type="Edm.String" Mode="In" />
        </FunctionImport>
        
        <FunctionImport Name="RejectRequest" ReturnType="Edm.Boolean" m:HttpMethod="POST">
          <Parameter Name="RequestId" Type="Edm.String" Mode="In" />
          <Parameter Name="ApproverId" Type="Edm.String" Mode="In" />
          <Parameter Name="Comments" Type="Edm.String" Mode="In" />
        </FunctionImport>
        
        <FunctionImport Name="CancelRequest" ReturnType="Edm.Boolean" m:HttpMethod="POST">
          <Parameter Name="RequestId" Type="Edm.String" Mode="In" />
          <Parameter Name="EmployeeId" Type="Edm.String" Mode="In" />
          <Parameter Name="Comments" Type="Edm.String" Mode="In" />
        </FunctionImport>
        
        <FunctionImport Name="CalculateRemainingDays" ReturnType="Edm.Int32" m:HttpMethod="GET">
          <Parameter Name="EmployeeId" Type="Edm.String" Mode="In" />
          <Parameter Name="Year" Type="Edm.String" Mode="In" />
        </FunctionImport>
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
```

## Implementación de Llamadas a Servicios Backend

### 1. Modelo Base para Servicios

Creamos un modelo base para gestionar las llamadas a servicios:

```javascript
// models/ServiceModel.js
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function (BaseObject, JSONModel) {
    "use strict";

    return BaseObject.extend("com.vacaciones.app.model.ServiceModel", {
        /**
         * Constructor del modelo de servicio
         * @param {sap.ui.core.UIComponent} oComponent - Componente de la aplicación
         */
        constructor: function (oComponent) {
            this._oComponent = oComponent;
            this._oODataModel = oComponent.getModel();
            this._oViewModel = new JSONModel();
        },
        
        /**
         * Obtiene el modelo de vista
         * @returns {sap.ui.model.json.JSONModel} Modelo de vista
         */
        getViewModel: function () {
            return this._oViewModel;
        },
        
        /**
         * Maneja errores de OData
         * @param {object} oError - Objeto de error
         * @param {function} fnCallback - Función de callback
         */
        _handleODataError: function (oError, fnCallback) {
            var sMessage = "Error en la comunicación con el servidor";
            
            if (oError.responseText) {
                try {
                    var oErrorResponse = JSON.parse(oError.responseText);
                    if (oErrorResponse.error && oErrorResponse.error.message) {
                        sMessage = oErrorResponse.error.message.value || oErrorResponse.error.message;
                    }
                } catch (e) {
                    // Error al parsear la respuesta
                    sMessage = oError.responseText;
                }
            }
            
            if (fnCallback) {
                fnCallback({
                    success: false,
                    message: sMessage
                });
            }
            
            return sMessage;
        }
    });
});
```

### 2. Servicio de Empleados

```javascript
// models/EmployeeService.js
sap.ui.define([
    "./ServiceModel"
], function (ServiceModel) {
    "use strict";

    return ServiceModel.extend("com.vacaciones.app.model.EmployeeService", {
        /**
         * Obtiene los datos del empleado actual
         * @param {function} fnCallback - Función de callback
         */
        getCurrentEmployee: function (fnCallback) {
            var that = this;
            
            // En un entorno real, obtendríamos el ID del empleado actual del sistema
            var sEmployeeId = "EMP001"; // Ejemplo
            
            this._oODataModel.read("/Employees('" + sEmployeeId + "')", {
                urlParameters: {
                    "$expand": "AbsenceRequests"
                },
                success: function (oData) {
                    that._oViewModel.setProperty("/employeeData", oData);
                    
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Obtiene los miembros del equipo del empleado actual
         * @param {function} fnCallback - Función de callback
         */
        getTeamMembers: function (fnCallback) {
            var that = this;
            var sEmployeeId = this._oViewModel.getProperty("/employeeData/EmployeeId") || "EMP001";
            
            this._oODataModel.read("/Employees", {
                urlParameters: {
                    "$filter": "ManagerId eq '" + sEmployeeId + "'"
                },
                success: function (oData) {
                    that._oViewModel.setProperty("/teamMembers", oData.results);
                    
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData.results
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Calcula los días de vacaciones disponibles
         * @param {string} sEmployeeId - ID del empleado
         * @param {string} sYear - Año
         * @param {function} fnCallback - Función de callback
         */
        calculateRemainingDays: function (sEmployeeId, sYear, fnCallback) {
            var that = this;
            
            this._oODataModel.callFunction("/CalculateRemainingDays", {
                method: "GET",
                urlParameters: {
                    "EmployeeId": sEmployeeId,
                    "Year": sYear
                },
                success: function (oData) {
                    var iRemainingDays = oData.value;
                    
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: iRemainingDays
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        }
    });
});
```

### 3. Servicio de Ausencias

```javascript
// models/AbsenceService.js
sap.ui.define([
    "./ServiceModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (ServiceModel, Filter, FilterOperator) {
    "use strict";

    return ServiceModel.extend("com.vacaciones.app.model.AbsenceService", {
        /**
         * Obtiene los tipos de ausencia
         * @param {function} fnCallback - Función de callback
         */
        getAbsenceTypes: function (fnCallback) {
            var that = this;
            
            this._oODataModel.read("/AbsenceTypes", {
                filters: [
                    new Filter("Status", FilterOperator.EQ, "A") // Solo tipos activos
                ],
                success: function (oData) {
                    that._oViewModel.setProperty("/absenceTypes", oData.results);
                    
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData.results
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Obtiene las solicitudes de ausencia
         * @param {string} sEmployeeId - ID del empleado (opcional)
         * @param {string} sStatus - Estado de la solicitud (opcional)
         * @param {function} fnCallback - Función de callback
         */
        getAbsenceRequests: function (sEmployeeId, sStatus, fnCallback) {
            var that = this;
            var aFilters = [];
            
            if (sEmployeeId) {
                aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId));
            }
            
            if (sStatus) {
                aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
            }
            
            this._oODataModel.read("/AbsenceRequests", {
                urlParameters: {
                    "$expand": "Employee,AbsenceType"
                },
                filters: aFilters,
                success: function (oData) {
                    // Procesar los datos para el calendario
                    var aProcessedData = that._processAbsenceRequestsForCalendar(oData.results);
                    that._oViewModel.setProperty("/absenceRequests", aProcessedData);
                    
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: aProcessedData
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Procesa las solicitudes de ausencia para el calendario
         * @param {Array} aRequests - Solicitudes de ausencia
         * @returns {Array} Datos procesados para el calendario
         * @private
         */
        _processAbsenceRequestsForCalendar: function (aRequests) {
            var oEmployeeMap = {};
            
            // Agrupar por empleado
            aRequests.forEach(function (oRequest) {
                var sEmployeeId = oRequest.EmployeeId;
                var sEmployeeName = oRequest.Employee ? oRequest.Employee.FirstName + " " + oRequest.Employee.LastName : "Desconocido";
                
                if (!oEmployeeMap[sEmployeeId]) {
                    oEmployeeMap[sEmployeeId] = {
                        title: sEmployeeName,
                        text: oRequest.Employee ? oRequest.Employee.Department : "",
                        icon: "sap-icon://person-placeholder",
                        appointments: []
                    };
                }
                
                // Determinar el tipo de cita según el estado
                var sType;
                switch (oRequest.Status) {
                    case "AP": // Aprobada
                        sType = "Type01";
                        break;
                    case "PE": // Pendiente
                        sType = "Type07";
                        break;
                    case "RE": // Rechazada
                        sType = "Type03";
                        break;
                    case "CA": // Cancelada
                        sType = "Type08";
                        break;
                    default:
                        sType = "Type01";
                }
                
                // Añadir la cita
                oEmployeeMap[sEmployeeId].appointments.push({
                    startDate: new Date(oRequest.StartDate),
                    endDate: new Date(oRequest.EndDate),
                    title: oRequest.AbsenceType ? oRequest.AbsenceType.Description : "Ausencia",
                    text: oRequest.Comments,
                    type: sType,
                    requestId: oRequest.RequestId
                });
            });
            
            // Convertir el mapa a un array
            return Object.values(oEmployeeMap);
        },
        
        /**
         * Crea una solicitud de ausencia
         * @param {object} oRequestData - Datos de la solicitud
         * @param {function} fnCallback - Función de callback
         */
        createAbsenceRequest: function (oRequestData, fnCallback) {
            var that = this;
            
            this._oODataModel.callFunction("/CreateAbsenceRequest", {
                method: "POST",
                urlParameters: {
                    "EmployeeId": oRequestData.EmployeeId,
                    "AbsenceTypeId": oRequestData.AbsenceTypeId,
                    "StartDate": oRequestData.StartDate,
                    "EndDate": oRequestData.EndDate,
                    "Comments": oRequestData.Comments
                },
                success: function (oData) {
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Aprueba una solicitud de ausencia
         * @param {string} sRequestId - ID de la solicitud
         * @param {string} sApproverId - ID del aprobador
         * @param {string} sComments - Comentarios
         * @param {function} fnCallback - Función de callback
         */
        approveRequest: function (sRequestId, sApproverId, sComments, fnCallback) {
            var that = this;
            
            this._oODataModel.callFunction("/ApproveRequest", {
                method: "POST",
                urlParameters: {
                    "RequestId": sRequestId,
                    "ApproverId": sApproverId,
                    "Comments": sComments
                },
                success: function (oData) {
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData.value
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Rechaza una solicitud de ausencia
         * @param {string} sRequestId - ID de la solicitud
         * @param {string} sApproverId - ID del aprobador
         * @param {string} sComments - Comentarios
         * @param {function} fnCallback - Función de callback
         */
        rejectRequest: function (sRequestId, sApproverId, sComments, fnCallback) {
            var that = this;
            
            this._oODataModel.callFunction("/RejectRequest", {
                method: "POST",
                urlParameters: {
                    "RequestId": sRequestId,
                    "ApproverId": sApproverId,
                    "Comments": sComments
                },
                success: function (oData) {
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData.value
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        },
        
        /**
         * Cancela una solicitud de ausencia
         * @param {string} sRequestId - ID de la solicitud
         * @param {string} sEmployeeId - ID del empleado
         * @param {string} sComments - Comentarios
         * @param {function} fnCallback - Función de callback
         */
        cancelRequest: function (sRequestId, sEmployeeId, sComments, fnCallback) {
            var that = this;
            
            this._oODataModel.callFunction("/CancelRequest", {
                method: "POST",
                urlParameters: {
                    "RequestId": sRequestId,
                    "EmployeeId": sEmployeeId,
                    "Comments": sComments
                },
                success: function (oData) {
                    if (fnCallback) {
                        fnCallback({
                            success: true,
                            data: oData.value
                        });
                    }
                },
                error: function (oError) {
                    that._handleODataError(oError, fnCallback);
                }
            });
        }
    });
});
```

### 4. Inicialización de Servicios en Component.js

```javascript
// Component.js
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models",
    "./model/EmployeeService",
    "./model/AbsenceService"
], function (UIComponent, Device, models, EmployeeService, AbsenceService) {
    "use strict";

    return UIComponent.extend("com.vacaciones.app.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * Inicialización del componente
         */
        init: function () {
            // Llamar a la función init del padre
            UIComponent.prototype.init.apply(this, arguments);

            // Establecer los modelos de datos
            this.setModel(models.createDeviceModel(), "device");
            
            // Inicializar servicios
            this._initServices();
            
            // Inicializar el enrutador
            this.getRouter().initialize();
        },
        
        /**
         * Inicializa los servicios
         * @private
         */
        _initServices: function () {
            // Crear servicios
            this._oEmployeeService = new EmployeeService(this);
            this._oAbsenceService = new AbsenceService(this);
            
            // Establecer modelos de vista
            this.setModel(this._oEmployeeService.getViewModel(), "employeeService");
            this.setModel(this._oAbsenceService.getViewModel(), "absenceService");
            
            // Cargar datos iniciales
            this._loadInitialData();
        },
        
        /**
         * Carga los datos iniciales
         * @private
         */
        _loadInitialData: function () {
            var that = this;
            
            // Cargar datos del empleado actual
            this._oEmployeeService.getCurrentEmployee(function (oResponse) {
                if (oResponse.success) {
                    // Cargar tipos de ausencia
                    that._oAbsenceService.getAbsenceTypes();
                    
                    // Cargar solicitudes de ausencia del empleado
                    that._oAbsenceService.getAbsenceRequests(oResponse.data.EmployeeId);
                }
            });
        },
        
        /**
         * Obtiene el servicio de empleados
         * @returns {com.vacaciones.app.model.EmployeeService} Servicio de empleados
         */
        getEmployeeService: function () {
            return this._oEmployeeService;
        },
        
        /**
         * Obtiene el servicio de ausencias
         * @returns {com.vacaciones.app.model.AbsenceService} Servicio de ausencias
         */
        getAbsenceService: function () {
            return this._oAbsenceService;
        }
    });
});
```

## Gestión de Autenticación y Autorización

### 1. Configuración de Autenticación SAP

La autenticación se gestiona a través del sistema SAP estándar. En el archivo `manifest.json`, configuramos:

```json
{
  "sap.app": {
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/ZHR_VACATION_SRV/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0",
          "localUri": "localService/metadata.xml"
        }
      }
    }
  }
}
```

### 2. Manejo de Autorización en Controladores

```javascript
// controller/App.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.vacaciones.app.controller.App", {
        /**
         * Inicialización del controlador
         */
        onInit: function () {
            // Obtener el router
            this.oRouter = this.getOwnerComponent().getRouter();
            
            // Inicializar el modelo de la vista
            var oViewModel = new JSONModel({
                selectedTab: "absences",
                busy: false,
                delay: 0,
                userRoles: {
                    isEmployee: true,
                    isManager: false,
                    isAdmin: false
                }
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Cargar roles de usuario
            this._loadUserRoles();
            
            // Registrar evento para cambios de ruta
            this.oRouter.getRoute("calendar").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("request").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("team").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("balance").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("admin").attachPatternMatched(this._onRouteMatched, this);
        },
        
        /**
         * Carga los roles del usuario
         * @private
         */
        _loadUserRoles: function () {
            var that = this;
            var oViewModel = this.getView().getModel("viewModel");
            
            // En un entorno real, obtendríamos los roles del usuario del sistema
            // Aquí simulamos la carga de roles
            setTimeout(function () {
                var oUserRoles = {
                    isEmployee: true,
                    isManager: true,
                    isAdmin: false
                };
                
                oViewModel.setProperty("/userRoles", oUserRoles);
                
                // Actualizar visibilidad de pestañas según roles
                that._updateTabVisibility();
            }, 500);
        },
        
        /**
         * Actualiza la visibilidad de las pestañas según los roles del usuario
         * @private
         */
        _updateTabVisibility: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oUserRoles = oViewModel.getProperty("/userRoles");
            
            // Obtener las pestañas
            var oIconTabHeader = this.byId("iconTabHeader");
            if (oIconTabHeader) {
                var aItems = oIconTabHeader.getItems();
                
                // Actualizar visibilidad
                aItems.forEach(function (oItem) {
                    var sKey = oItem.getKey();
                    
                    switch (sKey) {
                        case "team":
                            oItem.setVisible(oUserRoles.isManager || oUserRoles.isAdmin);
                            break;
                        case "admin":
                            oItem.setVisible(oUserRoles.isAdmin);
                            break;
                        default:
                            oItem.setVisible(true);
                            break;
                    }
                });
            }
        },
        
        /**
         * Verifica si el usuario tiene un rol específico
         * @param {string} sRole - Rol a verificar (isEmployee, isManager, isAdmin)
         * @returns {boolean} Verdadero si el usuario tiene el rol
         */
        hasRole: function (sRole) {
            var oViewModel = this.getView().getModel("viewModel");
            var oUserRoles = oViewModel.getProperty("/userRoles");
            
            return oUserRoles[sRole] === true;
        },
        
        /**
         * Maneja el evento de coincidencia de ruta
         * @param {sap.ui.base.Event} oEvent - Evento
         * @private
         */
        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oViewModel = this.getView().getModel("viewModel");
            
            // Verificar autorización para la ruta
            if (!this._checkRouteAuthorization(sRouteName)) {
                // Redirigir a una ruta autorizada
                this.oRouter.navTo("calendar");
                return;
            }
            
            // Actualizar la pestaña seleccionada según la ruta
            switch (sRouteName) {
                case "calendar":
                    oViewModel.setProperty("/selectedTab", "calendar");
                    this._loadView("Calendar");
                    break;
                case "request":
                    oViewModel.setProperty("/selectedTab", "requests");
                    this._loadView("Request");
                    break;
                case "team":
                    oViewModel.setProperty("/selectedTab", "team");
                    this._loadView("Team");
                    break;
                case "balance":
                    oViewModel.setProperty("/selectedTab", "balance");
                    this._loadView("Balance");
                    break;
                case "admin":
                    oViewModel.setProperty("/selectedTab", "admin");
                    this._loadView("Admin");
                    break;
            }
        },
        
        /**
         * Verifica la autorización para una ruta
         * @param {string} sRouteName - Nombre de la ruta
         * @returns {boolean} Verdadero si el usuario está autorizado
         * @private
         */
        _checkRouteAuthorization: function (sRouteName) {
            var oViewModel = this.getView().getModel("viewModel");
            var oUserRoles = oViewModel.getProperty("/userRoles");
            
            switch (sRouteName) {
                case "team":
                    return oUserRoles.isManager || oUserRoles.isAdmin;
                case "admin":
                    return oUserRoles.isAdmin;
                default:
                    return true;
            }
        }
    });
});
```

### 3. Formateador para Visibilidad Basada en Roles

```javascript
// model/formatter.js
sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Formatea la visibilidad basada en roles
         * @param {object} oUserRoles - Roles del usuario
         * @param {string} sRequiredRole - Rol requerido
         * @returns {boolean} Verdadero si el usuario tiene el rol requerido
         */
        visibleForRole: function (oUserRoles, sRequiredRole) {
            if (!oUserRoles || !sRequiredRole) {
                return false;
            }
            
            return oUserRoles[sRequiredRole] === true;
        },
        
        /**
         * Formatea la visibilidad para múltiples roles (OR)
         * @param {object} oUserRoles - Roles del usuario
         * @param {string} sRole1 - Primer rol
         * @param {string} sRole2 - Segundo rol
         * @returns {boolean} Verdadero si el usuario tiene al menos uno de los roles
         */
        visibleForAnyRole: function (oUserRoles, sRole1, sRole2) {
            if (!oUserRoles) {
                return false;
            }
            
            return (sRole1 && oUserRoles[sRole1] === true) || 
                   (sRole2 && oUserRoles[sRole2] === true);
        },
        
        /**
         * Formatea la habilitación basada en roles
         * @param {object} oUserRoles - Roles del usuario
         * @param {string} sRequiredRole - Rol requerido
         * @returns {boolean} Verdadero si el usuario tiene el rol requerido
         */
        enabledForRole: function (oUserRoles, sRequiredRole) {
            if (!oUserRoles || !sRequiredRole) {
                return false;
            }
            
            return oUserRoles[sRequiredRole] === true;
        }
    };
});
```

## Pruebas de Integración

### 1. Configuración de Entorno de Pruebas

```javascript
// test/integration/pages/Common.js
sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    return Opa5.extend("com.vacaciones.app.test.integration.pages.Common", {
        iStartTheApp: function () {
            return this.iStartMyUIComponent({
                componentConfig: {
                    name: "com.vacaciones.app",
                    async: true
                }
            });
        },
        
        iLookAtTheScreen: function () {
            return this;
        }
    });
});
```

### 2. Prueba de Integración de Calendario

```javascript
// test/integration/CalendarJourney.js
sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/Calendar"
], function (opaTest) {
    "use strict";

    QUnit.module("Calendar Journey");

    opaTest("Should see the calendar page", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp();

        // Actions
        When.onTheCalendarPage.iLookAtTheScreen();

        // Assertions
        Then.onTheCalendarPage.iShouldSeeTheCalendar();
        Then.onTheCalendarPage.iShouldSeeTheEmployeeProfile();
        Then.onTheCalendarPage.iShouldSeeTheAbsenceTypes();
        
        // Cleanup
        Then.iTeardownMyApp();
    });
    
    opaTest("Should navigate to request page", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp();

        // Actions
        When.onTheCalendarPage.iPressTheRequestButton();

        // Assertions
        Then.onTheRequestPage.iShouldSeeTheRequestForm();
        
        // Cleanup
        Then.iTeardownMyApp();
    });
});
```

### 3. Página de Prueba de Calendario

```javascript
// test/integration/pages/Calendar.js
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "./Common"
], function (Opa5, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheCalendarPage: {
            baseClass: Common,
            
            actions: {
                iPressTheRequestButton: function () {
                    return this.waitFor({
                        id: "requestButton",
                        viewName: "Calendar",
                        actions: new Press(),
                        errorMessage: "No se encontró el botón de solicitud"
                    });
                }
            },
            
            assertions: {
                iShouldSeeTheCalendar: function () {
                    return this.waitFor({
                        id: "calendar",
                        viewName: "Calendar",
                        success: function (oCalendar) {
                            Opa5.assert.ok(oCalendar, "El calendario es visible");
                        },
                        errorMessage: "No se encontró el calendario"
                    });
                },
                
                iShouldSeeTheEmployeeProfile: function () {
                    return this.waitFor({
                        controlType: "sap.m.ObjectIdentifier",
                        viewName: "Calendar",
                        success: function (aObjectIdentifiers) {
                            Opa5.assert.ok(aObjectIdentifiers.length > 0, "El perfil del empleado es visible");
                        },
                        errorMessage: "No se encontró el perfil del empleado"
                    });
                },
                
                iShouldSeeTheAbsenceTypes: function () {
                    return this.waitFor({
                        controlType: "sap.m.List",
                        viewName: "Calendar",
                        success: function (aLists) {
                            Opa5.assert.ok(aLists.length > 0, "La lista de tipos de ausencia es visible");
                        },
                        errorMessage: "No se encontró la lista de tipos de ausencia"
                    });
                }
            }
        }
    });
});
```

## Manejo de Errores y Mensajes

### 1. Clase de Utilidad para Mensajes

```javascript
// util/MessageHandler.js
sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseObject, MessageBox, MessageToast) {
    "use strict";

    return BaseObject.extend("com.vacaciones.app.util.MessageHandler", {
        /**
         * Constructor del manejador de mensajes
         * @param {sap.ui.core.UIComponent} oComponent - Componente de la aplicación
         */
        constructor: function (oComponent) {
            this._oComponent = oComponent;
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
        },
        
        /**
         * Muestra un mensaje de éxito
         * @param {string} sMessageKey - Clave del mensaje en el archivo de recursos
         * @param {Array} aArgs - Argumentos para el mensaje
         */
        showSuccess: function (sMessageKey, aArgs) {
            var sMessage = this._getMessage(sMessageKey, aArgs);
            MessageToast.show(sMessage);
        },
        
        /**
         * Muestra un mensaje de error
         * @param {string} sMessageKey - Clave del mensaje en el archivo de recursos
         * @param {Array} aArgs - Argumentos para el mensaje
         * @param {function} fnCallback - Función de callback
         */
        showError: function (sMessageKey, aArgs, fnCallback) {
            var sMessage = this._getMessage(sMessageKey, aArgs);
            MessageBox.error(sMessage, {
                onClose: fnCallback
            });
        },
        
        /**
         * Muestra un mensaje de advertencia
         * @param {string} sMessageKey - Clave del mensaje en el archivo de recursos
         * @param {Array} aArgs - Argumentos para el mensaje
         * @param {function} fnCallback - Función de callback
         */
        showWarning: function (sMessageKey, aArgs, fnCallback) {
            var sMessage = this._getMessage(sMessageKey, aArgs);
            MessageBox.warning(sMessage, {
                onClose: fnCallback
            });
        },
        
        /**
         * Muestra un mensaje de información
         * @param {string} sMessageKey - Clave del mensaje en el archivo de recursos
         * @param {Array} aArgs - Argumentos para el mensaje
         * @param {function} fnCallback - Función de callback
         */
        showInformation: function (sMessageKey, aArgs, fnCallback) {
            var sMessage = this._getMessage(sMessageKey, aArgs);
            MessageBox.information(sMessage, {
                onClose: fnCallback
            });
        },
        
        /**
         * Muestra un mensaje de confirmación
         * @param {string} sMessageKey - Clave del mensaje en el archivo de recursos
         * @param {Array} aArgs - Argumentos para el mensaje
         * @param {function} fnCallback - Función de callback
         */
        showConfirmation: function (sMessageKey, aArgs, fnCallback) {
            var sMessage = this._getMessage(sMessageKey, aArgs);
            MessageBox.confirm(sMessage, {
                onClose: fnCallback
            });
        },
        
        /**
         * Obtiene un mensaje del archivo de recursos
         * @param {string} sMessageKey - Clave del mensaje
         * @param {Array} aArgs - Argumentos para el mensaje
         * @returns {string} Mensaje
         * @private
         */
        _getMessage: function (sMessageKey, aArgs) {
            return this._oResourceBundle.getText(sMessageKey, aArgs) || sMessageKey;
        }
    });
});
```

### 2. Inicialización del Manejador de Mensajes en Component.js

```javascript
// Component.js (añadir a la inicialización)
_initServices: function () {
    // Crear servicios
    this._oEmployeeService = new EmployeeService(this);
    this._oAbsenceService = new AbsenceService(this);
    
    // Crear manejador de mensajes
    this._oMessageHandler = new MessageHandler(this);
    
    // Establecer modelos de vista
    this.setModel(this._oEmployeeService.getViewModel(), "employeeService");
    this.setModel(this._oAbsenceService.getViewModel(), "absenceService");
    
    // Cargar datos iniciales
    this._loadInitialData();
},

/**
 * Obtiene el manejador de mensajes
 * @returns {com.vacaciones.app.util.MessageHandler} Manejador de mensajes
 */
getMessageHandler: function () {
    return this._oMessageHandler;
}
```

### 3. Uso del Manejador de Mensajes en Controladores

```javascript
// controller/Request.controller.js (ejemplo de uso)
onSubmitPress: function () {
    var oViewModel = this.getView().getModel("viewModel");
    var oRequest = oViewModel.getProperty("/request");
    var oAbsenceService = this.getOwnerComponent().getAbsenceService();
    var oMessageHandler = this.getOwnerComponent().getMessageHandler();
    
    // Validar formulario
    if (!this._validateForm()) {
        return;
    }
    
    // Mostrar indicador de ocupado
    oViewModel.setProperty("/busy", true);
    
    // Preparar datos para el servicio
    var oRequestData = {
        EmployeeId: this.getOwnerComponent().getModel("employeeService").getProperty("/employeeData/EmployeeId"),
        AbsenceTypeId: oRequest.absenceTypeId,
        StartDate: oRequest.startDate,
        EndDate: oRequest.endDate,
        Comments: oRequest.comments
    };
    
    // Crear solicitud
    oAbsenceService.createAbsenceRequest(oRequestData, function (oResponse) {
        // Ocultar indicador de ocupado
        oViewModel.setProperty("/busy", false);
        
        if (oResponse.success) {
            // Mostrar mensaje de éxito
            oMessageHandler.showSuccess("requestSubmittedSuccess", null, function () {
                // Navegar de vuelta al calendario
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("calendar");
            }.bind(this));
        } else {
            // Mostrar mensaje de error
            oMessageHandler.showError("requestSubmittedError", [oResponse.message]);
        }
    }.bind(this));
}
```

## Consideraciones de Rendimiento

### 1. Optimización de Llamadas OData

Para optimizar el rendimiento de las llamadas OData, se implementan las siguientes técnicas:

1. **Uso de Batch Requests**: Configuración en manifest.json
   ```json
   "settings": {
     "useBatch": true
   }
   ```

2. **Filtrado en el Servidor**: Uso de filtros OData para reducir la cantidad de datos transferidos
   ```javascript
   this._oODataModel.read("/AbsenceRequests", {
       filters: [
           new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId),
           new Filter("Status", FilterOperator.EQ, "PE")
       ],
       // ...
   });
   ```

3. **Selección de Propiedades**: Especificar solo las propiedades necesarias
   ```javascript
   this._oODataModel.read("/Employees", {
       urlParameters: {
           "$select": "EmployeeId,FirstName,LastName,Department"
       },
       // ...
   });
   ```

4. **Expansión Controlada**: Expandir solo las entidades necesarias
   ```javascript
   this._oODataModel.read("/AbsenceRequests", {
       urlParameters: {
           "$expand": "Employee,AbsenceType"
       },
       // ...
   });
   ```

### 2. Caché de Datos

```javascript
// models/CacheManager.js
sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
    "use strict";

    return BaseObject.extend("com.vacaciones.app.model.CacheManager", {
        /**
         * Constructor del gestor de caché
         */
        constructor: function () {
            this._mCache = {};
            this._mExpiration = {};
        },
        
        /**
         * Establece un valor en la caché
         * @param {string} sKey - Clave
         * @param {any} vValue - Valor
         * @param {number} iExpirationMs - Tiempo de expiración en milisegundos (opcional)
         */
        set: function (sKey, vValue, iExpirationMs) {
            this._mCache[sKey] = vValue;
            
            if (iExpirationMs) {
                var iExpiration = Date.now() + iExpirationMs;
                this._mExpiration[sKey] = iExpiration;
                
                // Programar limpieza automática
                setTimeout(function () {
                    this.remove(sKey);
                }.bind(this), iExpirationMs);
            }
        },
        
        /**
         * Obtiene un valor de la caché
         * @param {string} sKey - Clave
         * @returns {any} Valor o undefined si no existe o ha expirado
         */
        get: function (sKey) {
            // Verificar expiración
            if (this._mExpiration[sKey] && Date.now() > this._mExpiration[sKey]) {
                this.remove(sKey);
                return undefined;
            }
            
            return this._mCache[sKey];
        },
        
        /**
         * Elimina un valor de la caché
         * @param {string} sKey - Clave
         */
        remove: function (sKey) {
            delete this._mCache[sKey];
            delete this._mExpiration[sKey];
        },
        
        /**
         * Limpia toda la caché
         */
        clear: function () {
            this._mCache = {};
            this._mExpiration = {};
        }
    });
});
```

### 3. Uso de la Caché en Servicios

```javascript
// models/AbsenceService.js (ejemplo de uso de caché)
getAbsenceTypes: function (fnCallback, bForceRefresh) {
    var that = this;
    var sCacheKey = "absenceTypes";
    var oCacheManager = this._oComponent.getCacheManager();
    
    // Verificar caché si no se fuerza la actualización
    if (!bForceRefresh) {
        var aTypes = oCacheManager.get(sCacheKey);
        if (aTypes) {
            that._oViewModel.setProperty("/absenceTypes", aTypes);
            
            if (fnCallback) {
                fnCallback({
                    success: true,
                    data: aTypes
                });
            }
            
            return;
        }
    }
    
    // Cargar desde el servidor
    this._oODataModel.read("/AbsenceTypes", {
        filters: [
            new Filter("Status", FilterOperator.EQ, "A") // Solo tipos activos
        ],
        success: function (oData) {
            // Guardar en caché (expira en 1 hora)
            oCacheManager.set(sCacheKey, oData.results, 3600000);
            
            that._oViewModel.setProperty("/absenceTypes", oData.results);
            
            if (fnCallback) {
                fnCallback({
                    success: true,
                    data: oData.results
                });
            }
        },
        error: function (oError) {
            that._handleODataError(oError, fnCallback);
        }
    });
}
```

## Resumen de la Integración

La integración entre el backend SAP y el frontend Fiori se ha implementado siguiendo las mejores prácticas:

1. **Configuración OData**: Conexión correcta al servicio ZHR_VACATION_SRV mediante configuración en manifest.json.

2. **Arquitectura de Servicios**: Implementación de clases de servicio para encapsular la lógica de comunicación con el backend.

3. **Gestión de Autenticación**: Uso del sistema de autenticación estándar de SAP.

4. **Control de Autorización**: Implementación de verificación de roles y permisos en la aplicación.

5. **Manejo de Errores**: Sistema centralizado para gestionar errores y mostrar mensajes al usuario.

6. **Optimización de Rendimiento**: Uso de batch requests, filtrado en servidor y caché de datos.

7. **Pruebas de Integración**: Implementación de pruebas automatizadas para verificar la correcta integración.

Esta integración garantiza una comunicación eficiente y segura entre la interfaz de usuario y la lógica de negocio, proporcionando una experiencia de usuario fluida y consistente.
