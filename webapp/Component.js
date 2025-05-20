sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, Device, models, JSONModel, MessageToast) {
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

            // Crear el modelo principal para la aplicación
            var oModel = new JSONModel({
                employeeData: null,
                absenceTypes: [],
                absenceRequests: [],
                counters: {
                    available: 0,
                    total: 0,
                    used: 0,
                    pending: 0
                },
                currentYear: new Date().getFullYear(),
                isLoading: false,
                error: null
            });
            
            // Set the model
            this.setModel(oModel, "appModel");

            // Initialize the OData model
            var oODataModel = new sap.ui.model.odata.v2.ODataModel(
                "/sap/opu/odata/sap/ZHR_VACATION_SRV/",
                {
                    json: true,
                    useBatch: false
                }
            );
            
            // Set the OData model
            this.setModel(oODataModel);

            // Initialize data
            this._initializeData();

            // Inicializar el enrutador
            this.getRouter().initialize();
        },

        /**
         * Initialize application data
         */
        _initializeData: function() {
            var oModel = this.getModel("appModel");
            oModel.setProperty("/isLoading", true);

            // Get employee data
            this.getModel().read("/EmployeeData", {
                success: function(oData) {
                    oModel.setProperty("/employeeData", oData);
                },
                error: function(oError) {
                    MessageToast.show("Error loading employee data");
                    console.error("Error loading employee data:", oError);
                }
            });

            // Get absence types
            this.getModel().read("/AbsenceTypes", {
                success: function(oData) {
                    oModel.setProperty("/absenceTypes", oData.results);
                },
                error: function(oError) {
                    MessageToast.show("Error loading absence types");
                    console.error("Error loading absence types:", oError);
                }
            });

            // Get absence requests
            this.getModel().read("/AbsenceRequests", {
                success: function(oData) {
                    oModel.setProperty("/absenceRequests", oData.results);
                    // Calculate counters
                    var oCounters = this._calculateCounters(oData.results);
                    oModel.setProperty("/counters", oCounters);
                    oModel.setProperty("/isLoading", false);
                }.bind(this),
                error: function(oError) {
                    MessageToast.show("Error loading absence requests");
                    console.error("Error loading absence requests:", oError);
                    oModel.setProperty("/isLoading", false);
                }
            });
        },

        /**
         * Calculate counters from absence requests
         */
        _calculateCounters: function(aRequests) {
            var oCounters = {
                available: 0,
                total: 0,
                used: 0,
                pending: 0
            };

            // Calculate totals
            aRequests.forEach(function(oRequest) {
                if (oRequest.Status === "APPROVED") {
                    oCounters.used += oRequest.Duration;
                } else if (oRequest.Status === "PENDING") {
                    oCounters.pending += oRequest.Duration;
                }
            });

            // Set total and available
            oCounters.total = 23; // This should come from employee data
            oCounters.available = oCounters.total - oCounters.used;

            return oCounters;
        },

        /**
         * Método para obtener el contenido principal
         */
        createContent: function () {
            // Crear la vista raíz
            var oApp = new sap.ui.view({
                viewName: "com.vacaciones.app.view.App",
                type: "XML"
            });
            
            return oApp;
        }
    });
});