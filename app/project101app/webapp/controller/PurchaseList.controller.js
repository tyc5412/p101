sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("demo.purchase.project101app.controller.PurchaseList", {
        onInit() {

            // create oData model pointing to CAP OData endpoint
            // const oModel = new sap.ui.model.odata.v2.ODataModel('https://port4004-workspaces-ws-9v0pm.us10.trial.applicationstudio.cloud.sap/odata/v4/purchase/');

            const oModel = new sap.ui.model.odata.v4.ODataModel({
                serviceUrl: "/odata/v4/purchase/"
            });

            // this.getView().setModel(oModel);


            // 简单方式：刷新列表
            // this.getView().getModel().refresh();
            // console.log(this.getView())
            // console.log(this.getView().getModel())
            // console.log(this.getView().getModel().refresh(true))


            // 显式绑定 List 控件（后面创建时方便刷新）
            this.oListBinding = oModel.bindList("/Purchases");
            this.byId("list").setBindingContext(null); // 清理上下文
            this.byId("list").setModel(oModel);
            this.byId("list").bindItems({
                path: "/Purchases",
                template: new sap.m.StandardListItem({
                    title: "{title}",
                    description: "{amount}",
                    info: "{status}"
                })
            });

        },

        onSelect() {
            const oListBinding = this.byId("list").getBinding("items");
            if (oListBinding) {
                oListBinding.refresh();
            }
        },

        onSubmit() {
            const title = this.byId('title').getValue();
            const amount = this.byId('amount').getValue();
            // create purchase via OData
            const payload = { title, amount, requester: 'demo.user' };
            console.log(this.getView())
            console.log(this.getView().getModel())
            try {
                const oModel = this.getView().getModel();
                // 关键：绑定到列表集合 /Purchases
                const oBinding = oModel.bindList("/Purchases");

                // 创建条目
                const oCreate = oBinding.create(payload);

                oCreate.created().then(() => {
                    sap.m.MessageToast.show("已创建");
                    // 提交成功后刷新列表绑定
                    this.onSelect()
                }).catch(() => {
                    sap.m.MessageToast.show("创建失败");
                });




                // this.getView().getModel().create('/Purchases', payload, {
                //     success: () => {
                //         sap.m.MessageToast.show('已创建')
                //     },
                //     error: () => {
                //         sap.m.MessageToast.show('创建失败')
                //     }
                // });
            } catch (error) {
                console.log(error)
            }

        }



    });
});