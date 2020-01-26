'use strict'
/**
 ** R - relation
 */

//to run with debug data: DEBUG=module:tools node directory;
const logTools = require('debug')('module:tools');
const to = function (promise) {
    return promise.then(data => {
        return [null, data];
    })
        .catch(err => [err]);
};
module.exports = function deleteRelations(Model, options) {
    Model.deleteRelationalById = (id, next) => {
        (async (next) => {
            let error = null;
            const setError = err => error = err;
            const [findInitErr, findInit] = await to(Model.findById(id));
            if (!findInit) return next({ error: `no such id in ${Model.name}` });
            if (findInitErr) setError(findInitErr);
            await deleteInstances(Model, [id], [], setError);
            //destroy initial instance by id: 
            let [deleteInitialErr, deleteInitial] = await to(Model.destroyById(id));
            if (deleteInitialErr) setError(deleteInitialErr);
            return next(error, { success: 1 })
        })(next)
    }
    /**
     * @param model (object) model to delete instances from
     * @param id (array) of model instance to handel
     * @param handledModelInstances (array) avoid infinate loop by checking if in this cycle the model was already checked
     * @param setError (function) for collecting all errors from function in one place 
     */
    //todo: turn to transaction and deal with errors
    const deleteInstances = async (model, id, handledModelInstances, setError) => {
        // if (!model || model.name.includes(handledModelInstances)) return; 
        const modelR = model.relations;
        if (!modelR) return;
        for (let Rname in modelR) {
            const R = modelR[Rname];
            switch (R.type) {
                case "belongsTo": break;
                case "hasOne": case "hasMany":
                    const nextModel = (R.modelThrough ? R.modelThrough : R.modelTo);
                    const foreignKey = R.keyTo;
                    const where = { or: id.map(id => ({ [foreignKey]: id })) };
                    logTools("model: ", nextModel.name, "where", where.or);
                    const [findErr, res] = await to(nextModel.find({ where: where }));
                    if (findErr) setError(findErr);
                    if (!res) continue;
                    const foundInstances = res.map(instance => instance.id);
                    logTools("foundInstances: ", foundInstances);
                    if (foundInstances.length === 0) continue;
                    const handledInstances = [...handledModelInstances, nextModel];
                    //We want this function to run from leaf to root so we call it first on the next level
                    await deleteInstances(nextModel, foundInstances, handledInstances, setError);
                    const [deleteErr, deleteRes] = await to(nextModel.destroyAll(where));
                    if (deleteErr) setError(deleteErr);
                    logTools("delete res: ", deleteRes);
                    break;
                default: logTools("We do not support relation type: %s in model %s", R.type, model.name);//!make sure log works %s
            }
        }
    }
    Model.remoteMethod("deleteRelationalById", {
        accepts: [{ arg: "id", type: "number", required: true }],
        http: { verb: "delete" },
        description: "the function deletes the instance and ***All related instances***",
        returns: { arg: "res", type: "object" }
    })
}