module.exports = function (cds, io) {
    const { Purchases } = cds.entities('demo.purchase');


    cds.on('CREATE', 'Purchases', async (req) => {
        req.data.ID = req.data.ID || cds.utils.uuid();
        req.data.createdAt = new Date();
        req.data.status = 'CREATED';
        return cds.tx(req).run(req.query);
    });


    cds.on('submitForApproval', async (req) => {
        const { purchaseId } = req.data;
        const tx = cds.transaction(req);
        const p = await tx.run(SELECT.one.from(Purchases).where({ ID: purchaseId }));
        if (!p) req.reject(404, 'Not found');


        // mark submitted
        await tx.run(UPDATE(Purchases).set({ status: 'SUBMITTED' }).where({ ID: purchaseId }));


        // Publish event (local emit) - CAP eventing
        const event = {
            ID: purchaseId,
            title: p.title,
            amount: p.amount,
            requester: p.requester,
            createdAt: new Date()
        };


        // cds.emit (CAP event) - if Event Mesh is bound, CDS will route it.
        try {
            cds.emit('purchase.created', event);
        } catch (e) {
            console.warn('emit failed', e.message);
        }


        // Also push to Event Mesh via AMQP OR Router (示例使用脚本向外发送)
        // Notify connected frontends via websocket
        io.emit('purchase:update', { id: purchaseId, status: 'SUBMITTED' });


        // Optionally start workflow
        // require('./workflow-starter').startWorkflow(purchaseId, p);


        return 'OK';
    });
};