sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/unified/CalendarAppointment",
    "sap/ui/unified/DateTypeRange",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, CalendarAppointment, DateTypeRange, DateFormat) {
    "use strict";

    return Controller.extend("com.vacaciones.app.controller.Calendar", {
        /**
         * Inicialización del controlador
         */
        onInit: function () {
            // Inicializar el modelo de la vista
            var oViewModel = new JSONModel({
                calendarViewType: "Month",
                startDate: new Date(),
                currentPeriodText: "",
                selectedDate: null,
                absenceTypes: []
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Actualizar texto del período actual
            this._updateCurrentPeriodText();
            
            // Cargar datos de calendario
            this._loadCalendarData();
        },
        
        /**
         * Carga los datos del calendario
         */
        _loadCalendarData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oViewModel = this.getView().getModel("viewModel");
            
            // Simular datos de ausencias (en una aplicación real, esto vendría del backend)
            var aAbsenceRequests = [
                {
                    title: "Mis Ausencias",
                    text: "Susana Navarro Ruiz",
                    icon: "sap-icon://person-placeholder",
                    appointments: [
                        {
                            startDate: new Date(2024, 0, 10),
                            endDate: new Date(2024, 0, 15),
                            title: "Vacaciones",
                            text: "Vacaciones de invierno",
                            type: "Type01"
                        },
                        {
                            startDate: new Date(2024, 3, 10),
                            endDate: new Date(2024, 3, 15),
                            title: "Vacaciones",
                            text: "Semana Santa",
                            type: "Type01"
                        },
                        {
                            startDate: new Date(2024, 6, 1),
                            endDate: new Date(2024, 6, 15),
                            title: "Vacaciones",
                            text: "Vacaciones de verano",
                            type: "Type01"
                        }
                    ]
                }
            ];
            
            // Actualizar el modelo
            oModel.setProperty("/absenceRequests", aAbsenceRequests);
        },
        
        /**
         * Actualiza el texto del período actual
         */
        _updateCurrentPeriodText: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oDateFormat = DateFormat.getDateInstance({style: "medium"});
            var oStartDate = oViewModel.getProperty("/startDate");
            var sViewType = oViewModel.getProperty("/calendarViewType");
            var sText = "";
            
            switch (sViewType) {
                case "Day":
                    sText = oDateFormat.format(oStartDate);
                    break;
                case "Week":
                    var oEndDate = new Date(oStartDate);
                    oEndDate.setDate(oStartDate.getDate() + 6);
                    sText = oDateFormat.format(oStartDate) + " - " + oDateFormat.format(oEndDate);
                    break;
                case "Month":
                    var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                    var oDateFormatMonth = DateFormat.getDateInstance({pattern: "MMMM yyyy"}, oLocale);
                    sText = oDateFormatMonth.format(oStartDate);
                    break;
                case "Year":
                    sText = String(oStartDate.getFullYear());
                    break;
            }
            
            oViewModel.setProperty("/currentPeriodText", sText);
        },
        
        /**
         * Maneja el cambio de tipo de vista del calendario
         */
        onCalendarViewTypeChange: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var sKey = oEvent.getParameter("key");
            
            oViewModel.setProperty("/calendarViewType", sKey);
            this._updateCurrentPeriodText();
        },
        
        /**
         * Maneja el evento de período anterior
         */
        onPreviousPeriod: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oStartDate = new Date(oViewModel.getProperty("/startDate"));
            var sViewType = oViewModel.getProperty("/calendarViewType");
            
            switch (sViewType) {
                case "Day":
                    oStartDate.setDate(oStartDate.getDate() - 1);
                    break;
                case "Week":
                    oStartDate.setDate(oStartDate.getDate() - 7);
                    break;
                case "Month":
                    oStartDate.setMonth(oStartDate.getMonth() - 1);
                    break;
                case "Year":
                    oStartDate.setFullYear(oStartDate.getFullYear() - 1);
                    break;
            }
            
            oViewModel.setProperty("/startDate", oStartDate);
            this._updateCurrentPeriodText();
        },
        
        /**
         * Maneja el evento de período siguiente
         */
        onNextPeriod: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oStartDate = new Date(oViewModel.getProperty("/startDate"));
            var sViewType = oViewModel.getProperty("/calendarViewType");
            
            switch (sViewType) {
                case "Day":
                    oStartDate.setDate(oStartDate.getDate() + 1);
                    break;
                case "Week":
                    oStartDate.setDate(oStartDate.getDate() + 7);
                    break;
                case "Month":
                    oStartDate.setMonth(oStartDate.getMonth() + 1);
                    break;
                case "Year":
                    oStartDate.setFullYear(oStartDate.getFullYear() + 1);
                    break;
            }
            
            oViewModel.setProperty("/startDate", oStartDate);
            this._updateCurrentPeriodText();
        },
        
        /**
         * Maneja el evento de selección de cita
         */
        onAppointmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment");
            
            if (oAppointment) {
                MessageToast.show("Cita seleccionada: " + oAppointment.getTitle());
                // Implementar lógica para mostrar detalles de la ausencia
            }
        },
        
        /**
         * Maneja el evento de selección de intervalo
         */
        onIntervalSelect: function (oEvent) {
            var oStartDate = oEvent.getParameter("startDate");
            var oEndDate = oEvent.getParameter("endDate");
            var oViewModel = this.getView().getModel("viewModel");
            
            oViewModel.setProperty("/selectedDate", oStartDate);
            
            // Navegar a la vista de solicitud con las fechas preseleccionadas
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("request", {
                startDate: oStartDate.getTime(),
                endDate: oEndDate.getTime()
            });
        },
        
        /**
         * Maneja el evento de cambio de filtro de tipo de ausencia
         */
        onAbsenceTypeFilterChange: function (oEvent) {
            var aSelectedItems = oEvent.getSource().getSelectedItems();
            var aSelectedTypes = aSelectedItems.map(function (oItem) {
                return oItem.getTitle();
            });
            
            // Implementar lógica de filtrado
            MessageToast.show("Filtro cambiado: " + aSelectedTypes.join(", "));
        },
        
        /**
         * Maneja el evento de acciones
         */
        onActionsPress: function () {
            MessageToast.show("Acciones");
            // Implementar menú de acciones
        }
    });
});