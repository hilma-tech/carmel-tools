// example:
// export default ModulePlatform = {
//     auth_rn: require('./../../../auth/consts/HooksList_rn')
// }


const fs = require('fs');
let path = require('path');
let pathToModule = null;

let modulesList = require(`../../../../../consts/ModulesConfig.json`).modulesList;
let platforms = ['rn', 'web', 'cordova'];

let modulePlatformObj = {}
fs.writeFileSync('../modulePlatform.js', "export default ModulePlatform = { ")

let modplat = ""
modulesList.forEach(mdl => {
    platforms.forEach(plt => {
        try {
            pathToModule = path.join(__dirname, "../../../../", `${mdl}/consts`, `HooksList_${plt}.js`);
            console.log(pathToModule)
            if (fs.existsSync(pathToModule)) {
                modplat = `${mdl}_${plt}`;
                modulePlatformObj[`${mdl}_${plt}`] = `require${(`./../../../../${mdl}/consts/HooksList_${plt}`)}`
                fs.appendFileSync('../modulePlatform.js', `${modplat}:require${`('./../../../${mdl}/consts/HooksList_${plt}').default,\n`}`)
                // fs.appendFileSync('../src/modules/tools/client/hooks/modulePlatform.js', `${modplat}:${`'./../../../${mdl}/consts/HooksList_${plt}',\n`}`)
            }
        }
        catch (err) {
            console.log("err", mdl)
        }
    });
});

fs.appendFileSync('../modulePlatform.js', "}")
modulePlatformObj = JSON.stringify(modulePlatformObj);
// console.log(modulePlatformObj)
