sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, MessageBox, DateFormat) {
    "use strict";

    return Controller.extend("com.vacaciones.app.controller.Request", {
        /**
         * Inicialización del controlador
         */
        onInit: function () {
            // Inicializar el modelo de la vista
            var oViewModel = new JSONModel({
                request: {
                    absenceTypeId: "VAC",
                    startDate: new Date(),
                    endDate: new Date(),
                    totalDays: 1,
                    comments: "",
                    requiresAttachment: false,
                    approverId: "MANAGER1",
                    attachmentName: ""
                },
                busy: false
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Registrar evento para cambios de ruta
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("request").attachPatternMatched(this._onRouteMatched, this);
        },
        
        /**
         * Maneja el evento de coincidencia de ruta
         */
        _onRouteMatched: function (oEvent) {
            var oArguments = oEvent.getParameter("arguments");
            var oViewModel = this.getView().getModel("viewModel");
            
            // Verificar si hay fechas preseleccionadas
            if (oArguments.startDate && oArguments.endDate) {
                var oStartDate = new Date(parseInt(oArguments.startDate));
                var oEndDate = new Date(parseInt(oArguments.endDate));
                
                oViewModel.setProperty("/request/startDate", oStartDate);
                oViewModel.setProperty("/request/endDate", oEndDate);
                
                // Calcular días laborables
                this._calculateWorkingDays(oStartDate, oEndDate);
            } else {
                // Inicializar con la fecha actual
                var oToday = new Date();
                oViewModel.setProperty("/request/startDate", oToday);
                oViewModel.setProperty("/request/endDate", oToday);
                oViewModel.setProperty("/request/totalDays", 1);
            }
            
            // Verificar si el tipo de ausencia requiere adjunto
            this._checkAttachmentRequired();
        },
        
        /**
         * Calcula los días laborables entre dos fechas
         */
        _calculateWorkingDays: function (oStartDate, oEndDate) {
            var oViewModel = this.getView().getModel("viewModel");
            var iDays = 0;
            var oCurrentDate = new Date(oStartDate);
            
            // Iterar por cada día entre las fechas
            while (oCurrentDate <= oEndDate) {
                // Verificar si es día laborable (lunes a viernes)
                var iDay = oCurrentDate.getDay();
                if (iDay !== 0 && iDay !== 6) {
                    iDays++;
                }
                
                // Avanzar al siguiente día
                oCurrentDate.setDate(oCurrentDate.getDate() + 1);
            }
            
            oViewModel.setProperty("/request/totalDays", iDays);
        },
        
        /**
         * Verifica si el tipo de ausencia seleccionado requiere adjunto
         */
        _checkAttachmentRequired: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oModel = this.getOwnerComponent().getModel();
            var sAbsenceTypeId = oViewModel.getProperty("/request/absenceTypeId");
            
            // Buscar el tipo de ausencia seleccionado
            var aAbsenceTypes = oModel.getProperty("/absenceTypes");
            var oAbsenceType = aAbsenceTypes.find(function (oType) {
                return oType.id === sAbsenceTypeId;
            });
            
            // Actualizar el flag de requerimiento de adjunto
            var bRequiresAttachment = sAbsenceTypeId === "BAJ"; // Ejemplo: Baja requiere adjunto
            oViewModel.setProperty("/request/requiresAttachment", bRequiresAttachment);
        },
        
        /**
         * Maneja el cambio de tipo de ausencia
         */
        onAbsenceTypeChange: function (oEvent) {
            this._checkAttachmentRequired();
        },
        
        /**
         * Maneja el cambio de fecha
         */
        onDateChange: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var oStartDate = oViewModel.getProperty("/request/startDate");
            var oEndDate = oViewModel.getProperty("/request/endDate");
            
            // Asegurar que la fecha de fin no sea anterior a la de inicio
            if (oEndDate < oStartDate) {
                oViewModel.setProperty("/request/endDate", oStartDate);
                oEndDate = oStartDate;
            }
            
            // Actualizar el calendario
            var oCalendar = this.byId("calendarPreview");
            if (oCalendar) {
                oCalendar.removeAllSelectedDates();
                oCalendar.addSelectedDate(new sap.ui.unified.DateRange({
                    startDate: oStartDate,
                    endDate: oEndDate
                }));
            }
            
            // Calcular días laborables
            this._calculateWorkingDays(oStartDate, oEndDate);
        },
        
        /**
         * Maneja la selección en el calendario
         */
        onCalendarSelect: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var oCalendar = oEvent.getSource();
            var aSelectedDates = oCalendar.getSelectedDates();
            
            if (aSelectedDates.length > 0) {
                var oDateRange = aSelectedDates[0];
                var oStartDate = oDateRange.getStartDate();
                var oEndDate = oDateRange.getEndDate() || oStartDate;
                
                // Actualizar el modelo
                oViewModel.setProperty("/request/startDate", oStartDate);
                oViewModel.setProperty("/request/endDate", oEndDate);
                
                // Actualizar los DatePickers
                var oStartDatePicker = this.byId("startDatePicker");
                var oEndDatePicker = this.byId("endDatePicker");
                
                if (oStartDatePicker) {
                    oStartDatePicker.setDateValue(oStartDate);
                }
                
                if (oEndDatePicker) {
                    oEndDatePicker.setDateValue(oEndDate);
                }
                
                // Calcular días laborables
                this._calculateWorkingDays(oStartDate, oEndDate);
            }
        },
        
        /**
         * Maneja el cambio de archivo
         */
        onFileChange: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var oFileUploader = oEvent.getSource();
            var sFileName = oFileUploader.getValue();
            
            if (sFileName) {
                oViewModel.setProperty("/request/attachmentName", sFileName);
            }
        },
        
        /**
         * Maneja el evento de cancelar
         */
        onCancelPress: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("calendar");
        },
        
        /**
         * Maneja el evento de enviar solicitud
         */
        onSubmitPress: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oRequest = oViewModel.getProperty("/request");
            var oModel = this.getOwnerComponent().getModel();
            
            // Validar formulario
            if (!this._validateForm()) {
                return;
            }
            
            // Mostrar indicador de ocupado
            oViewModel.setProperty("/busy", true);
            
            // Simular envío al backend (en una aplicación real, esto sería una llamada OData)
            setTimeout(function () {
                // Crear nueva solicitud en el modelo
                var aAbsenceRequests = oModel.getProperty("/absenceRequests");
                var oAbsenceTypes = oModel.getProperty("/absenceTypes");
                
                // Buscar el tipo de ausencia
                var oAbsenceType = oAbsenceTypes.find(function (oType) {
                    return oType.id === oRequest.absenceTypeId;
                });
                
                // Añadir la cita al calendario
                if (aAbsenceRequests.length > 0 && aAbsenceRequests[0].appointments) {
                    aAbsenceRequests[0].appointments.push({
                        startDate: oRequest.startDate,
                        endDate: oRequest.endDate,
                        title: oAbsenceType ? oAbsenceType.description : "Ausencia",
                        text: oRequest.comments,
                        type: "Type07" // Pendiente
                    });
                    
                    oModel.setProperty("/absenceRequests", aAbsenceRequests);
                }
                
                // Actualizar contadores
                var oCounters = oModel.getProperty("/counters");
                oCounters.pending += oRequest.totalDays;
                oModel.setProperty("/counters", oCounters);
                
                // Ocultar indicador de ocupado
                oViewModel.setProperty("/busy", false);
                
                // Mostrar mensaje de éxito
                MessageBox.success(
                    this.getView().getModel("i18n").getResourceBundle().getText("requestSubmittedSuccess"),
                    {
                        onClose: function () {
                            // Navegar de vuelta al calendario
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("calendar");
                        }.bind(this)
                    }
                );
            }.bind(this), 1000);
        },
        
        /**
         * Valida el formulario de solicitud
         */
        _validateForm: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oRequest = oViewModel.getProperty("/request");
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var bValid = true;
            
            // Validar tipo de ausencia
            if (!oRequest.absenceTypeId) {
                MessageToast.show(oResourceBundle.getText("selectAbsenceType"));
                bValid = false;
            }
            
            // Validar fechas
            if (!oRequest.startDate || !oRequest.endDate) {
                MessageToast.show(oResourceBundle.getText("selectDates"));
                bValid = false;
            }
            
            // Validar adjunto si es requerido
            if (oRequest.requiresAttachment && !oRequest.attachmentName) {
                MessageToast.show(oResourceBundle.getText("attachmentRequired"));
                bValid = false;
            }
            
            return bValid;
        },
        
        /**
         * Maneja el evento de navegación hacia atrás
         */
        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("calendar");
        }
    });
});