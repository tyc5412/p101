sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("demo.purchase.project101app.controller.PurchaseDetail", {

        onInit() {

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("PurchaseDetail").attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function (oEvent) {

            const sID = oEvent.getParameter("arguments").ID;
            // const sPath = `/Purchase(${sID})`;  // CAP OData v4 默认格式
            const sPath = `/Purchases('${sID}')`;
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    expand: "Items" // 如果有关联实体
                },
                events: {
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePurchaseList");
            }
        }
    });
});
