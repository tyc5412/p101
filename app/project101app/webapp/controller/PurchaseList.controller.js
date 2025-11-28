sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/ObjectListItem"
], function (Controller, ObjectListItem) {
    "use strict";

    return Controller.extend("demo.purchase.project101app.controller.PurchaseList", {
        onInit() {
            const oModel = new sap.ui.model.odata.v4.ODataModel({
                serviceUrl: "/odata/v4/purchase/"
            });
            this.getView().setModel(oModel);

            this.byId("list").bindItems({
                path: "/Purchases",
                template: new ObjectListItem({
                    title: "{title}",
                    number: "{amount}",
                    numberUnit: "USD",
                    intro: "{status}"
                })
            });
        },

        onItemPress(oEvent) {
            const oItem = oEvent.getParameter("listItem");
            if (!oItem) {
                console.error("No listItem in event");
                return;
            }
            const sID = oItem.getBindingContext().getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("PurchaseDetail", { ID: sID });
        },

        onSelect() {
            this.byId("list").getBinding("items").refresh();
        },

        onSubmit() {
            const title = this.byId("title").getValue();
            const amount = this.byId("amount").getValue();
            const payload = { title, amount, requester: "demo.user" };
            const oModel = this.getView().getModel();
            const oBinding = oModel.bindList("/Purchases");

            oBinding.create(payload)
                .created()
                .then(() => {
                    sap.m.MessageToast.show("已创建");
                    this.onSelect();
                })
                .catch(() => {
                    sap.m.MessageToast.show("创建失败");
                });
        }
    });
});
