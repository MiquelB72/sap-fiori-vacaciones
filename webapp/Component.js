sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models"
], function (UIComponent, Device, models) {
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
            var oModel = new sap.ui.model.json.JSONModel({
                employeeData: {},
                absenceTypes: [],
                absenceRequests: [],
                counters: {
                    available: 12,
                    total: 23,
                    used: 3,
                    pending: 0
                },
                currentYear: new Date().getFullYear()
            });
            this.setModel(oModel);

            // Inicializar el enrutador
            this.getRouter().initialize();
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