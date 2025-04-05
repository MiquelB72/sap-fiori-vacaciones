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
                delay: 0
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Cargar datos iniciales
            this._loadInitialData();
            
            // Registrar evento para cambios de ruta
            this.oRouter.getRoute("calendar").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("request").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("team").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("balance").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("admin").attachPatternMatched(this._onRouteMatched, this);
        },
        
        /**
         * Carga los datos iniciales de la aplicación
         */
        _loadInitialData: function () {
            var oModel = this.getOwnerComponent().getModel();
            
            // Simular carga de datos (en una aplicación real, esto vendría del backend)
            var oEmployeeData = {
                id: "EMP001",
                firstName: "Susana",
                lastName: "Navarro Ruiz",
                department: "Sales Spain",
                position: "Sales Development",
                manager: "Manager",
                photo: "https://randomuser.me/api/portraits/women/44.jpg"
            };
            
            var aAbsenceTypes = [
                { id: "VAC", description: "Vacaciones", color: "#4CAF50", count: 12 },
                { id: "MUD", description: "Mudanza", color: "#FFC107", count: 2 },
                { id: "BAJ", description: "Baja (leve)", color: "#F44336", count: 4 },
                { id: "SOB", description: "Sobre tiempo", color: "#2196F3", count: 6 }
            ];
            
            // Actualizar el modelo
            oModel.setProperty("/employeeData", oEmployeeData);
            oModel.setProperty("/absenceTypes", aAbsenceTypes);
            
            // Cargar el contenido inicial
            this._loadView("Calendar");
        },
        
        /**
         * Maneja el evento de selección de pestaña
         */
        onTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key");
            var oViewModel = this.getView().getModel("viewModel");
            
            oViewModel.setProperty("/selectedTab", sKey);
            
            // Navegar a la vista correspondiente
            switch (sKey) {
                case "absences":
                case "calendar":
                    this.oRouter.navTo("calendar");
                    break;
                case "team":
                    this.oRouter.navTo("team");
                    break;
                case "balance":
                    this.oRouter.navTo("balance");
                    break;
                case "requests":
                    this.oRouter.navTo("request");
                    break;
                case "admin":
                    this.oRouter.navTo("admin");
                    break;
                default:
                    this.oRouter.navTo("calendar");
                    break;
            }
        },
        
        /**
         * Maneja el evento de coincidencia de ruta
         */
        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oViewModel = this.getView().getModel("viewModel");
            
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
         * Carga una vista en el NavContainer
         */
        _loadView: function (sViewName) {
            var oNavContainer = this.byId("navContainer");
            var sViewId = this.getView().getId() + "-" + sViewName;
            var oView = sap.ui.getCore().byId(sViewId);
            
            if (!oView) {
                oView = sap.ui.view({
                    id: sViewId,
                    viewName: "com.vacaciones.app.view." + sViewName,
                    type: "XML"
                });
            }
            
            oNavContainer.addPage(oView);
            oNavContainer.to(oView.getId());
        },
        
        /**
         * Maneja el evento de solicitud de ausencia
         */
        onRequestAbsence: function () {
            this.oRouter.navTo("request");
        },
        
        /**
         * Maneja el evento de búsqueda
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            MessageToast.show("Búsqueda: " + sQuery);
            // Implementar lógica de búsqueda
        },
        
        /**
         * Maneja el evento de configuración
         */
        onSettingsPress: function () {
            MessageToast.show("Configuración");
            // Implementar diálogo de configuración
        },
        
        /**
         * Maneja el evento de usuario
         */
        onUserPress: function () {
            MessageToast.show("Perfil de usuario");
            // Implementar diálogo de perfil
        },
        
        /**
         * Maneja el evento de navegación hacia atrás
         */
        onNavBack: function () {
            window.history.go(-1);
        }
    });
});