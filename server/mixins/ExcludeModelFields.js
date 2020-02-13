'use strict';

const logTools = require('debug')('module:tools');
const path = require('path');
const fs = require('fs');

let defaultExcludedFields = {
    "Audio": ["owner"],
    "CustomUser": ["id", "password", "credentials", "emailVerified", "verificationToken"],
    "Files": ["owner"],
    "Images": ["owner"],
    "Notification": ["user_id"],
    "NotificationsMap": ["user_id"],
    "RoleMapping": ["principalId"],
    "User": ["id", "password", "credentials", "emailVerified", "verificationToken"],
    "Video": ["owner"],
    "Games": ["ownerId"],
    "RecordsPermissions": ["principalId"],
    "Passwords": ["id", "owner", "password"],
    "AccessLogger": ["id", "email", "created"]
};
const excludedFieldsFilePath = path.join(__dirname, '../../../../../server', 'exclude-model-fields.json');
// logTools("excluded fields file path", excludedFieldsFilePath);
let excludedFields = defaultExcludedFields;
try {
    // Try the exclude-model-fields.json first
    excludedFields = JSON.parse(fs.readFileSync(excludedFieldsFilePath, 'utf8'));
    if (!excludedFields) excludedFields = defaultExcludedFields;
} catch (err) {
    // Fall back to empty object
    logTools(`Could not fetch /server/exclude-model-fields.json and parse it`);
    excludedFields = defaultExcludedFields;
}


// logTools("Excluded fields are", excludedFields);

module.exports = function ExcludeModelFields(Model) {

    Model.afterRemote('*', function (ctx, modelInstance, next) {
        logTools("ExcludeModelFields mixin is now launched", Model.name);
        if (!ctx || !ctx.result || typeof ctx.result !== "object") return next();

        let field = null;
        if (Array.isArray(ctx.result)) {
            for (const element of ctx.result) {
                field = (element && element.__data || element);
                deleteExcludedFields(field, Model);
            }

            logTools("after delete ctx.result", ctx.result);
            return next();
        }

        field = (ctx.result && ctx.result.__data) || ctx.result;
        deleteExcludedFields(field, Model);
        logTools("after delete ctx.result", ctx.result);

        return next();
    });

    function deleteExcludedFields(field, model) {
        const modelName = model.name;
        logTools("deleteExcludedFields is launched with model '%s'", modelName);
        if (!field || !excludedFields) return;
        const eModelFields = excludedFields[modelName];

        for (let key in field) {
            if (eModelFields.includes(key)) {
                delete field[key];
                logTools("ExcludeModelFields on Model '%s' deleted key '%s'", modelName, key);
            }

            const modelR = model.relations;
            if (!modelR) return;
            for (let Rname in modelR) {
                if (key === Rname) {
                    const R = modelR[Rname];
                    logTools("R.modelTo.name", R.modelTo.name);

                    let newField = null;
                    if (Array.isArray(field[key])) {
                        logTools("Field found was array");
                        for (const element of field[key]) {
                            newField = (element && element.__data || element);
                            deleteExcludedFields(newField, R.modelTo);
                        }
                        continue;
                    }

                    logTools("Field found was object");

                    newField = (field[key] && field[key].__data || field[key]);
                    deleteExcludedFields(newField, R.modelTo)
                }
            }
        }
    }
}
