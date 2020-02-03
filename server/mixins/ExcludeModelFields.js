'use strict';

const logTools = require('debug')('module:tools');
const excludedFields = require('./../../../../consts/exclude-model-fields.json')

module.exports = function ExcludeModelFields(Model) {

    Model.afterRemote('*', function (ctx, modelInstance, next) {
        logTools("ExcludeModelFields mixin is now launched", Model.name);
        if (!ctx || !ctx.result || typeof ctx.result !== "object") return next();

        let field = null;
        if (Array.isArray(ctx.result)) {
            for (const element of ctx.result) {
                field = (element && element.__data || element);
                deleteExcludedFields(field, Model.name);
            }

            logTools("after delete ctx.result", ctx.result);
            return next();
        }

        field = (ctx.result && ctx.result.__data) || ctx.result;
        deleteExcludedFields(field, Model.name);
        logTools("after delete ctx.result", ctx.result);

        return next();
    });

    function deleteExcludedFields(field, modelName) {
        if (!field) return;
        const eModelFields = excludedFields[modelName];

        for (let key in field) {
            // if (!ctx.result.__data.hasOwnProperty(key)) continue;
            if (eModelFields.includes(key)) {
                delete field[key];
                logTools("ExcludeModelFields on Model '%s' deleted key '%s'", modelName, key);
            }

            const modelR = Model.relations;
            if (!modelR) return;
            for (let Rname in modelR) {
                if (key === Rname) {
                    const R = modelR[Rname];
                    logTools("R.modelTo.name", R.modelTo.name);
                    let newField = (field[key] && field[key].__data || field[key]);
                    deleteExcludedFields(newField, R.modelTo.name)
                }
            }
        }
    }
}
