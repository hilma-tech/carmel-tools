'use strict'
/**
 ** R - relation
 */
//todo: make sure current model has not yet been gon through...

//to run with debug data: DEBUG=module:tools node directory;
const logTools = require('debug')('module:tools');
const to = function (promise) {
    return promise.then(data => {
        return [null, data];
    })
        .catch(err => [err]);
};
module.exports = function deleteRelations(Model, options) {
    Model.deleteByIdRelational = (id, destroyInstances, cb) => {
        (async () => {
            let error = null;
            let modelThrough = [];
            const setErr = err => error = err;
            logTools("recived delete, the id is: ", id, "destroy: ", destroyInstances);
            const initialModel = Model;
            await deleteInstances(initialModel, id, destroyInstances, setErr, modelThrough);
            //now what do we do aboute the id???
            logTools("destroing self(father of all)")
            let [delSelfErr, res] = await to(initialModel.destroyById(id));
            if (delSelfErr) setErr(delSelfErr);
            logTools("res:  destroy self", res);
            logTools("don! error is: ", error);
            return cb(error, { success: 1 });
            // return cb(null,{success: 1});
        })()
    }
    //switch all the find to delete
    const deleteInstances = async (model, id, destroyInstances = true, setErr, modelThrough) => {
        if(modelThrough.includes(model.name))return;
        logTools("going to destroy instances: ", destroyInstances);
        let ModelR = model.relations;
        logTools("model name: ", model.name);
        if (!ModelR) return;
        for (let Rname in ModelR) {
            logTools("relation name", Rname);
            const R = ModelR[Rname];
            logTools("to table: ", R.modelTo.name);
            switch (R.type) {
                case "belongsTo":
                    logTools("BelongsTo")//, Rname);
                    break;
                case "hasOne": case "hasMany":
                    logTools("Has some")//, Rname)
                    deleteInstances(R.modelTo, undefined, destroyInstances,setErr, [...modelThrough, model.name]);
                    const foreignKey = R.keyTo;
                    //where foreign key if our id
                    if (!id || !foreignKey) break;
                    logTools("back to model", model.name, "to: ", R.modelTo.name, "with relation: ", Rname)
                    //bed information and patient data should turn into null and not delete ....
                    //change find to destroyAll
                    //*default of destroyInstances === true
                    if (destroyInstances) {
                        logTools("deleting instances");
                        let [deleteErr, data] = await to(R.modelTo.destroyAll({ [foreignKey]: id }));
                        if (deleteErr) setErr(deleteErr);
                        logTools("found instances in", R.modelTo.name, "where: ", JSON.stringify({ where: { [foreignKey]: id } }));
                        logTools("data", data);
                    } else {
                        //the foreignkey of each instance that matches { [foreignKey]: id } should turn to null
                        let [updateErr, data] = await to(R.modelTo.updateAll({ [foreignKey]: id }, { [foreignKey]: null }));
                        if (updateErr) setErr(updateErr);
                        logTools("where: ", JSON.stringify({ where: { [foreignKey]: id } }));
                        logTools("data", data);
                    }
                    break;
            }
        }
    }
    Model.remoteMethod('deleteByIdRelational', {
        accepts: [{
            arg: 'id',
            type: "number",
            required: true,
        },
        {
            arg: "destroyInstances",
            type: "boolean"
        }],
        http: { verb: "delete" },
        description: "delete data and all of it's relations!!",
        returns: { arg: "res", type: "object" }
    })

}