# Implementación Frontend Fiori - Aplicación de Gestión de Vacaciones

## Estructura del Proyecto

Para implementar la aplicación Fiori de gestión de vacaciones, utilizaremos el framework SAPUI5 y seguiremos la arquitectura MVC (Modelo-Vista-Controlador). A continuación se detalla la estructura del proyecto y los archivos principales.

```
webapp/
├── Component.js              # Componente principal de la aplicación
├── manifest.json             # Configuración de la aplicación
├── index.html                # Punto de entrada HTML
├── controller/               # Controladores
│   ├── App.controller.js     # Controlador principal
│   ├── Calendar.controller.js # Controlador de calendario
│   ├── Request.controller.js # Controlador de solicitudes
│   ├── Team.controller.js    # Controlador de equipo
│   ├── Balance.controller.js # Controlador de saldos
│   └── Admin.controller.js   # Controlador de administración
├── view/                     # Vistas
│   ├── App.view.xml          # Vista principal
│   ├── Calendar.view.xml     # Vista de calendario
│   ├── Request.view.xml      # Vista de solicitud
│   ├── Team.view.xml         # Vista de equipo
│   ├── Balance.view.xml      # Vista de saldos
│   └── Admin.view.xml        # Vista de administración
├── model/                    # Modelos
│   ├── models.js             # Configuración de modelos
│   └── formatter.js          # Funciones de formato
├── i18n/                     # Internacionalización
│   └── i18n.properties       # Textos en español
└── css/                      # Estilos
    └── style.css             # Estilos personalizados
```

## Implementación de Archivos Principales

### 1. Component.js

```javascript
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
```

### 2. manifest.json

```json
{
    "_version": "1.12.0",
    "sap.app": {
        "id": "com.vacaciones.app",
        "type": "application",
        "i18n": "i18n/i18n.properties",
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
                    "odataVersion": "2.0"
                }
            }
        }
    },
    "sap.ui": {
        "technology": "UI5",
        "deviceTypes": {
            "desktop": true,
            "tablet": true,
            "phone": true
        }
    },
    "sap.ui5": {
        "rootView": {
            "viewName": "com.vacaciones.app.view.App",
            "type": "XML",
            "id": "app"
        },
        "dependencies": {
            "minUI5Version": "1.60.0",
            "libs": {
                "sap.ui.core": {},
                "sap.m": {},
                "sap.ui.layout": {},
                "sap.f": {},
                "sap.ui.unified": {}
            }
        },
        "models": {
            "i18n": {
                "type": "sap.ui.model.resource.ResourceModel",
                "settings": {
                    "bundleName": "com.vacaciones.app.i18n.i18n"
                }
            },
            "": {
                "dataSource": "mainService",
                "preload": true
            }
        },
        "routing": {
            "config": {
                "routerClass": "sap.m.routing.Router",
                "viewType": "XML",
                "viewPath": "com.vacaciones.app.view",
                "controlId": "app",
                "controlAggregation": "pages",
                "transition": "slide",
                "bypassed": {
                    "target": "notFound"
                }
            },
            "routes": [
                {
                    "pattern": "",
                    "name": "calendar",
                    "target": "calendar"
                },
                {
                    "pattern": "request",
                    "name": "request",
                    "target": "request"
                },
                {
                    "pattern": "team",
                    "name": "team",
                    "target": "team"
                },
                {
                    "pattern": "balance",
                    "name": "balance",
                    "target": "balance"
                },
                {
                    "pattern": "admin",
                    "name": "admin",
                    "target": "admin"
                }
            ],
            "targets": {
                "calendar": {
                    "viewName": "Calendar",
                    "viewLevel": 1
                },
                "request": {
                    "viewName": "Request",
                    "viewLevel": 2
                },
                "team": {
                    "viewName": "Team",
                    "viewLevel": 1
                },
                "balance": {
                    "viewName": "Balance",
                    "viewLevel": 1
                },
                "admin": {
                    "viewName": "Admin",
                    "viewLevel": 1
                },
                "notFound": {
                    "viewName": "NotFound",
                    "viewLevel": 3
                }
            }
        },
        "contentDensities": {
            "compact": true,
            "cozy": true
        }
    }
}
```

### 3. App.view.xml

```xml
<mvc:View
    controllerName="com.vacaciones.app.controller.App"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:f="sap.f"
    xmlns:core="sap.ui.core"
    displayBlock="true"
    height="100%">
    <App id="app">
        <pages>
            <Page
                id="mainPage"
                showHeader="true"
                title="{i18n>appTitle}"
                class="sapUiContentPadding">
                <customHeader>
                    <Toolbar>
                        <Button
                            icon="sap-icon://nav-back"
                            press=".onNavBack"
                            visible="{= ${device>/system/phone} }"/>
                        <Title text="{i18n>appTitle}" level="H2"/>
                        <ToolbarSpacer/>
                        <IconTabHeader
                            id="iconTabHeader"
                            selectedKey="{/selectedTab}"
                            select=".onTabSelect"
                            mode="Inline"
                            backgroundDesign="Transparent">
                            <items>
                                <IconTabFilter
                                    key="absences"
                                    text="{i18n>tabAbsences}"/>
                                <IconTabFilter
                                    key="calendar"
                                    text="{i18n>tabCalendar}"/>
                                <IconTabFilter
                                    key="team"
                                    text="{i18n>tabTeam}"/>
                                <IconTabFilter
                                    key="balance"
                                    text="{i18n>tabBalance}"/>
                                <IconTabFilter
                                    key="requests"
                                    text="{i18n>tabRequests}"/>
                                <IconTabFilter
                                    key="reports"
                                    text="{i18n>tabReports}"/>
                                <IconTabFilter
                                    key="admin"
                                    text="{i18n>tabAdmin}"/>
                            </items>
                        </IconTabHeader>
                        <ToolbarSpacer/>
                        <SearchField width="auto" search=".onSearch"/>
                        <Button icon="sap-icon://settings" press=".onSettingsPress"/>
                        <Button icon="sap-icon://person-placeholder" press=".onUserPress"/>
                    </Toolbar>
                </customHeader>
                <content>
                    <NavContainer id="navContainer">
                        <!-- El contenido se cargará dinámicamente según la pestaña seleccionada -->
                    </NavContainer>
                </content>
                <footer>
                    <Toolbar>
                        <ToolbarSpacer/>
                        <ObjectStatus
                            title="{i18n>availableDays}"
                            text="{/counters/available}d"
                            state="Success"
                            icon="sap-icon://calendar"/>
                        <ObjectStatus
                            title="{i18n>totalDays}"
                            text="{/counters/total}d"
                            state="Information"
                            icon="sap-icon://calendar"/>
                        <ObjectStatus
                            title="{i18n>usedDays}"
                            text="{/counters/used}d"
                            state="Warning"
                            icon="sap-icon://calendar"/>
                        <ObjectStatus
                            title="{i18n>pendingDays}"
                            text="{/counters/pending}d"
                            state="Error"
                            icon="sap-icon://calendar"/>
                        <ToolbarSpacer/>
                        <Button
                            type="Emphasized"
                            text="{i18n>requestAbsence}"
                            icon="sap-icon://add"
                            press=".onRequestAbsence"/>
                    </Toolbar>
                </footer>
            </Page>
        </pages>
    </App>
</mvc:View>
```

### 4. App.controller.js

```javascript
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
```

### 5. Calendar.view.xml

```xml
<mvc:View
    controllerName="com.vacaciones.app.controller.Calendar"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:unified="sap.ui.unified"
    xmlns:core="sap.ui.core"
    xmlns:layout="sap.ui.layout"
    height="100%">
    <Page
        showHeader="false"
        enableScrolling="true">
        <content>
            <layout:FixFlex>
                <layout:fixContent>
                    <VBox class="sapUiSmallMargin">
                        <HBox justifyContent="SpaceBetween" alignItems="Center">
                            <VBox>
                                <Avatar
                                    src="{/employeeData/photo}"
                                    displaySize="L"
                                    class="sapUiSmallMarginEnd"/>
                                <ObjectIdentifier
                                    title="{/employeeData/firstName} {/employeeData/lastName}"
                                    text="{/employeeData/department} - {/employeeData/position}"/>
                            </VBox>
                            <HBox>
                                <SegmentedButton
                                    selectedKey="{viewModel>/calendarViewType}"
                                    select=".onCalendarViewTypeChange">
                                    <items>
                                        <SegmentedButtonItem
                                            icon="sap-icon://calendar"
                                            key="Day"
                                            tooltip="{i18n>dayView}"/>
                                        <SegmentedButtonItem
                                            icon="sap-icon://calendar"
                                            key="Week"
                                            tooltip="{i18n>weekView}"/>
                                        <SegmentedButtonItem
                                            icon="sap-icon://calendar"
                                            key="Month"
                                            tooltip="{i18n>monthView}"/>
                                        <SegmentedButtonItem
                                            icon="sap-icon://calendar"
                                            key="Year"
                                            tooltip="{i18n>yearView}"/>
                                    </items>
                                </SegmentedButton>
                                <Button
                                    icon="sap-icon://arrow-left"
                                    press=".onPreviousPeriod"
                                    tooltip="{i18n>previousPeriod}"
                                    class="sapUiTinyMarginBegin"/>
                                <Text
                                    text="{viewModel>/currentPeriodText}"
                                    class="sapUiTinyMarginBegin sapUiTinyMarginEnd"/>
                                <Button
                                    icon="sap-icon://arrow-right"
                                    press=".onNextPeriod"
                                    tooltip="{i18n>nextPeriod}"/>
                            </HBox>
                            <Button
                                text="{i18n>actions}"
                                type="Transparent"
                                press=".onActionsPress"/>
                        </HBox>
                    </VBox>
                </layout:fixContent>
                <layout:flexContent>
                    <unified:PlanningCalendar
                        id="calendar"
                        startDate="{viewModel>/startDate}"
                        rows="{/absenceRequests}"
                        viewKey="{viewModel>/calendarViewType}"
                        appointmentSelect=".onAppointmentSelect"
                        intervalSelect=".onIntervalSelect"
                        showEmptyIntervalHeaders="false"
                        showRowHeaders="true"
                        showWeekNumbers="true">
                        <unified:rows>
                            <unified:PlanningCalendarRow
                                title="{title}"
                                text="{text}"
                                icon="{icon}"
                                appointments="{appointments}">
                                <unified:appointments>
                                    <unified:CalendarAppointment
                                        startDate="{startDate}"
                                        endDate="{endDate}"
                                        title="{title}"
                                        text="{text}"
                                        type="{type}"
                                        icon="{icon}"/>
                                </unified:appointments>
                            </unified:PlanningCalendarRow>
                        </unified:rows>
                    </unified:PlanningCalendar>
                </layout:flexContent>
            </layout:FixFlex>
        </content>
        <footer>
            <Toolbar>
                <Title text="{i18n>absencesByType}" level="H3"/>
                <ToolbarSpacer/>
                <List
                    items="{/absenceTypes}"
                    mode="MultiSelect"
                    includeItemInSelection="true"
                    selectionChange=".onAbsenceTypeFilterChange">
                    <StandardListItem
                        title="{description}"
                        info="{count}"
                        infoState="Information"
                        type="Active">
                        <customData>
                            <core:CustomData
                                key="color"
                                value="{color}"/>
                        </customData>
                    </StandardListItem>
                </List>
            </Toolbar>
        </footer>
    </Page>
</mvc:View>
```

### 6. Calendar.controller.js

```javascript
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
```

### 7. Request.view.xml

```xml
<mvc:View
    controllerName="com.vacaciones.app.controller.Request"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:f="sap.ui.layout.form"
    xmlns:core="sap.ui.core"
    xmlns:unified="sap.ui.unified"
    height="100%">
    <Page
        title="{i18n>newAbsenceRequest}"
        showNavButton="true"
        navButtonPress=".onNavBack">
        <content>
            <f:SimpleForm
                editable="true"
                layout="ResponsiveGridLayout"
                labelSpanXL="4"
                labelSpanL="4"
                labelSpanM="4"
                labelSpanS="12"
                adjustLabelSpan="false"
                emptySpanXL="0"
                emptySpanL="0"
                emptySpanM="0"
                emptySpanS="0"
                columnsXL="2"
                columnsL="2"
                columnsM="1"
                singleContainerFullSize="false">
                <f:content>
                    <Label text="{i18n>absenceType}" required="true"/>
                    <Select
                        id="absenceTypeSelect"
                        items="{/absenceTypes}"
                        selectedKey="{viewModel>/request/absenceTypeId}"
                        change=".onAbsenceTypeChange"
                        required="true">
                        <core:Item key="{id}" text="{description}"/>
                    </Select>
                    
                    <Label text="{i18n>startDate}" required="true"/>
                    <DatePicker
                        id="startDatePicker"
                        value="{viewModel>/request/startDate}"
                        valueFormat="yyyy-MM-dd"
                        displayFormat="long"
                        change=".onDateChange"
                        required="true"/>
                    
                    <Label text="{i18n>endDate}" required="true"/>
                    <DatePicker
                        id="endDatePicker"
                        value="{viewModel>/request/endDate}"
                        valueFormat="yyyy-MM-dd"
                        displayFormat="long"
                        change=".onDateChange"
                        required="true"/>
                    
                    <Label text="{i18n>totalDays}"/>
                    <Text text="{viewModel>/request/totalDays} {i18n>workingDays}"/>
                    
                    <Label text="{i18n>comments}"/>
                    <TextArea
                        value="{viewModel>/request/comments}"
                        rows="4"
                        width="100%"/>
                    
                    <Label text="{i18n>attachment}" visible="{viewModel>/request/requiresAttachment}"/>
                    <VBox visible="{viewModel>/request/requiresAttachment}">
                        <unified:FileUploader
                            id="fileUploader"
                            name="myFileUpload"
                            uploadUrl="upload/"
                            width="100%"
                            tooltip="{i18n>attachmentTooltip}"
                            placeholder="{i18n>selectFile}"
                            change=".onFileChange"/>
                        <Text
                            text="{i18n>attachmentHint}"
                            class="sapUiTinyMarginTop"/>
                    </VBox>
                    
                    <Label text="{i18n>approver}"/>
                    <Select
                        id="approverSelect"
                        selectedKey="{viewModel>/request/approverId}">
                        <core:Item key="MANAGER1" text="Juan Pérez (Responsable)"/>
                        <core:Item key="MANAGER2" text="María García (Directora)"/>
                    </Select>
                </f:content>
            </f:SimpleForm>
            
            <Panel
                headerText="{i18n>calendarPreview}"
                expandable="true"
                expanded="true"
                class="sapUiResponsiveMargin">
                <unified:Calendar
                    id="calendarPreview"
                    intervalSelection="true"
                    months="1"
                    startDate="{viewModel>/request/startDate}"
                    select=".onCalendarSelect">
                    <unified:specialDates>
                        <unified:SpecialDate
                            startDate="{viewModel>/request/startDate}"
                            endDate="{viewModel>/request/endDate}"
                            type="Type01"/>
                    </unified:specialDates>
                </unified:Calendar>
            </Panel>
        </content>
        <footer>
            <Toolbar>
                <ToolbarSpacer/>
                <Button
                    text="{i18n>cancel}"
                    press=".onCancelPress"/>
                <Button
                    text="{i18n>submitRequest}"
                    type="Emphasized"
                    press=".onSubmitPress"/>
            </Toolbar>
        </footer>
    </Page>
</mvc:View>
```

### 8. Request.controller.js

```javascript
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
```

### 9. i18n/i18n.properties

```properties
# App Descriptor
appTitle=Gestión de Vacaciones
appDescription=Aplicación para la gestión de vacaciones y ausencias

# Tabs
tabAbsences=Ausencias
tabCalendar=Mi calendario
tabTeam=Mi equipo
tabBalance=Saldos
tabRequests=Solicitudes
tabReports=Informes
tabAdmin=Administración

# Calendar
dayView=Vista diaria
weekView=Vista semanal
monthView=Vista mensual
yearView=Vista anual
previousPeriod=Período anterior
nextPeriod=Período siguiente
actions=Acciones
absencesByType=Ausencias por tipo

# Counters
availableDays=Disponible
totalDays=Total
usedDays=Disfrutados
pendingDays=Pendientes
workingDays=días laborables

# Request Form
newAbsenceRequest=Nueva Solicitud de Ausencia
absenceType=Tipo de ausencia
startDate=Fecha inicio
endDate=Fecha fin
comments=Comentarios
attachment=Adjuntar justificante
attachmentTooltip=Seleccione un archivo para adjuntar
selectFile=Seleccionar archivo
attachmentHint=Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
approver=Aprobador
calendarPreview=Vista previa de calendario
cancel=Cancelar
submitRequest=Enviar solicitud
requestAbsence=Solicitar ausencia

# Messages
selectAbsenceType=Por favor, seleccione un tipo de ausencia
selectDates=Por favor, seleccione las fechas de inicio y fin
attachmentRequired=Se requiere un documento justificante para este tipo de ausencia
requestSubmittedSuccess=Solicitud enviada correctamente. Recibirá una notificación cuando sea procesada.

# Team View
pendingApprovals=Solicitudes pendientes de aprobación
teamCalendar=Calendario del equipo
approve=Aprobar
reject=Rechazar

# Balance View
myBalance=Mis Saldos
absenceHistory=Histórico de ausencias
annualEvolution=Evolución anual

# Admin View
absenceTypeManagement=Gestión de tipos de ausencia
holidayManagement=Gestión de días festivos
approvalFlowManagement=Gestión de flujos de aprobación
reportsManagement=Gestión de informes
addType=Añadir tipo
```

## Implementación de CSS Personalizado

### css/style.css

```css
/* Estilos generales */
.sapMPageHeader {
    background-color: #1D4F91;
}

.sapMTitle {
    color: #333333;
}

/* Estilos para el calendario */
.sapUiCalItem.sapUiCalItemSel {
    background-color: #4CAF50;
    color: #FFFFFF;
}

.sapUiCalItemType01 {
    background-color: #4CAF50;
    color: #FFFFFF;
}

.sapUiCalItemType02 {
    background-color: #FFC107;
    color: #333333;
}

.sapUiCalItemType03 {
    background-color: #F44336;
    color: #FFFFFF;
}

.sapUiCalItemType04 {
    background-color: #2196F3;
    color: #FFFFFF;
}

/* Estilos para contadores */
.sapMObjStatusSuccess {
    color: #4CAF50;
}

.sapMObjStatusWarning {
    color: #FFC107;
}

.sapMObjStatusError {
    color: #F44336;
}

.sapMObjStatusInformation {
    color: #2196F3;
}

/* Estilos para perfil de usuario */
.sapMAvatar {
    border: 2px solid #1D4F91;
}

/* Estilos para formularios */
.sapMLabel.sapMLabelRequired::before {
    color: #F44336;
}

/* Estilos para botones */
.sapMBtnInner.sapMBtnEmphasized {
    background-color: #1D4F91;
    border-color: #1D4F91;
}

.sapMBtnInner.sapMBtnEmphasized:hover {
    background-color: #2C5EA9;
    border-color: #2C5EA9;
}

/* Estilos para tipos de ausencia */
.absenceType-VAC {
    border-left: 4px solid #4CAF50;
}

.absenceType-MUD {
    border-left: 4px solid #FFC107;
}

.absenceType-BAJ {
    border-left: 4px solid #F44336;
}

.absenceType-SOB {
    border-left: 4px solid #2196F3;
}

/* Estilos responsivos */
@media (max-width: 600px) {
    .sapMPageHeader {
        padding: 0.5rem;
    }
    
    .sapMITH {
        display: none;
    }
}
```

## Implementación de Archivo Index.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Vacaciones</title>
    
    <script
        id="sap-ui-bootstrap"
        src="https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_fiori_3"
        data-sap-ui-resourceroots='{
            "com.vacaciones.app": "./"
        }'
        data-sap-ui-compatVersion="edge"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="trusted"
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport">
    </script>
</head>
<body class="sapUiBody" id="content">
    <div data-sap-ui-component
        data-name="com.vacaciones.app"
        data-id="container"
        data-settings='{"id" : "vacaciones"}'
        style="height: 100%">
    </div>
</body>
</html>
```

## Integración con Backend SAP

Para la integración con el backend SAP, utilizaremos el modelo OData proporcionado por el servicio ZHR_VACATION_SRV. A continuación se muestra cómo se realizaría la integración en un entorno real:

### Configuración del Modelo OData

```javascript
// En Component.js
init: function () {
    // Llamar a la función init del padre
    UIComponent.prototype.init.apply(this, arguments);

    // Establecer los modelos de datos
    this.setModel(models.createDeviceModel(), "device");

    // Configurar el modelo OData
    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHR_VACATION_SRV/", {
        useBatch: true,
        defaultUpdateMethod: "PUT"
    });
    this.setModel(oModel);

    // Inicializar el enrutador
    this.getRouter().initialize();
}
```

### Ejemplo de Llamada al Servicio OData

```javascript
// En Calendar.controller.js
_loadCalendarData: function () {
    var oModel = this.getOwnerComponent().getModel();
    var oViewModel = this.getView().getModel("viewModel");
    
    // Mostrar indicador de ocupado
    oViewModel.setProperty("/busy", true);
    
    // Obtener datos de ausencias del servicio OData
    oModel.read("/AbsenceRequests", {
        urlParameters: {
            "$expand": "Employee,AbsenceType"
        },
        success: function (oData) {
            // Procesar los datos recibidos
            var aAbsenceRequests = this._processAbsenceData(oData.results);
            
            // Actualizar el modelo
            var oAppModel = this.getOwnerComponent().getModel();
            oAppModel.setProperty("/absenceRequests", aAbsenceRequests);
            
            // Ocultar indicador de ocupado
            oViewModel.setProperty("/busy", false);
        }.bind(this),
        error: function (oError) {
            // Manejar error
            MessageBox.error("Error al cargar los datos de ausencias");
            
            // Ocultar indicador de ocupado
            oViewModel.setProperty("/busy", false);
        }.bind(this)
    });
}
```

### Ejemplo de Creación de Solicitud

```javascript
// En Request.controller.js
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
    
    // Preparar datos para el servicio OData
    var oRequestData = {
        EmployeeId: this.getOwnerComponent().getModel().getProperty("/employeeData/id"),
        AbsenceTypeId: oRequest.absenceTypeId,
        StartDate: oRequest.startDate,
        EndDate: oRequest.endDate,
        TotalDays: oRequest.totalDays,
        Comments: oRequest.comments,
        Status: "PE" // Pendiente
    };
    
    // Crear solicitud a través del servicio OData
    oModel.create("/AbsenceRequests", oRequestData, {
        success: function (oData) {
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
        }.bind(this),
        error: function (oError) {
            // Ocultar indicador de ocupado
            oViewModel.setProperty("/busy", false);
            
            // Mostrar mensaje de error
            MessageBox.error(
                "Error al enviar la solicitud: " + oError.message
            );
        }.bind(this)
    });
}
```

## Consideraciones Adicionales

### Seguridad y Autenticación

La aplicación utilizará la autenticación estándar de SAP para garantizar que solo los usuarios autorizados puedan acceder a la aplicación y realizar acciones según sus roles.

### Rendimiento

Para optimizar el rendimiento, se implementarán las siguientes medidas:

1. Uso de modelos JSON para datos locales y OData para comunicación con el backend
2. Carga diferida de vistas y fragmentos
3. Uso de batch requests para reducir el número de llamadas al servidor
4. Implementación de caché para datos que no cambian frecuentemente

### Accesibilidad

La aplicación cumplirá con los estándares de accesibilidad WCAG 2.1, incluyendo:

1. Etiquetas descriptivas para todos los campos
2. Navegación completa por teclado
3. Compatibilidad con lectores de pantalla
4. Contraste adecuado entre texto y fondo

### Internacionalización

La aplicación está preparada para soportar múltiples idiomas mediante el uso de archivos de recursos i18n. Inicialmente se implementará en español, pero se puede extender fácilmente a otros idiomas.

### Pruebas

Se implementarán pruebas unitarias y de integración para garantizar la calidad del código y el correcto funcionamiento de la aplicación.
