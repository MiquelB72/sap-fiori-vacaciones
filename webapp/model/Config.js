sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/base/Log"
], function (JSONModel, Log) {
    "use strict";

    return {
        /**
         * Initialize configuration from config.json
         * @returns {Promise} Promise that resolves with the configuration
         */
        initialize: function() {
            var oConfig = {
                services: {
                    vacationService: {
                        baseUrl: "https://your-sap-system.com", // Default value
                        servicePath: "/sap/opu/odata/sap/ZHR_VACATION_SRV/",
                        sapClient: "100",
                        language: "ES",
                        crossOrigin: false,
                        useMockData: false
                    }
                },
                ui: {
                    theme: "sap_fiori_3",
                    language: "ES",
                    contentDensity: "cozy"
                },
                security: {
                    tokenRefreshInterval: 300000,
                    tokenRefreshThreshold: 300000,
                    tokenRefreshUrl: ""
                }
            };

            try {
                // Try to load configuration from config.json
                var oConfigFile = require("./config/config.json");
                Object.assign(oConfig, oConfigFile);
            } catch (e) {
                Log.warning("Could not load config.json, using default configuration");
            }

            // Create JSON model with configuration
            var oConfigModel = new JSONModel(oConfig);
            return oConfigModel;
        },

        /**
         * Get service URL with parameters
         * @param {string} sServiceName Name of the service
         * @returns {string} Full service URL
         */
        getServiceUrl: function(sServiceName) {
            var oConfig = this.getModel().getData();
            var oService = oConfig.services[sServiceName];
            
            if (!oService) {
                throw new Error("Service " + sServiceName + " not found in configuration");
            }

            var aParams = [];
            if (oService.sapClient) {
                aParams.push("sap-client=" + oService.sapClient);
            }
            if (oService.language) {
                aParams.push("sap-language=" + oService.language);
            }

            var sParams = aParams.length > 0 ? "?" + aParams.join("&") : "";
            return oService.baseUrl + oService.servicePath + sParams;
        },

        /**
         * Get configuration model
         * @returns {sap.ui.model.json.JSONModel} Configuration model
         */
        getModel: function() {
            return sap.ui.getCore().getModel("config");
        }
    };
});
