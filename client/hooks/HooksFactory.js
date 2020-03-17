'use strict';

import HooksRepository from './HooksRepository'
import PlatformHandler from "./../../../tools/client/PlatformHandler"

class HooksFactory {
    hooksRepository = null;
    constructor() {
        this.hooksRepository = new HooksRepository();
        this.initRepository()


    }

    async initRepository() {

        try {
            let modulesList = require(`./../../../../consts/ModulesConfig.json`).modulesList;
            let moduleInstance = null;
            this.platformOptions = PlatformHandler.getPlatformOptions()
            if (modulesList) {
                for (let moduleName of modulesList) {

                    try {
                        switch (this.platformOptions.suffix) {
                            case "rn": {

                                moduleInstance = await import(`./../../../${moduleName}/consts/HooksList_rn`);
                                moduleInstance = moduleInstance.default

                                break;

                            }
                            case "web": {
                                moduleInstance = await import(`./../../../${moduleName}/consts/HooksList_web`);
                                moduleInstance = moduleInstance.default
                                break;

                            }
                            case "cordova": {
                                moduleInstance = await import(`./../../../${moduleName}/consts/HooksList_cordova`);
                                moduleInstance = moduleInstance.default
                                break;

                            }


                            default: {
                                moduleInstance = await import(`./../../../${moduleName}/consts/HooksList`);
                                moduleInstance = moduleInstance.default

                            }

                        }
                        new moduleInstance(this.hooksRepository).addHooks()

                    } catch (err) {
                        console.log("err from ", moduleName)
                    }

                }
            }
        }
        catch (error) {
            console.log("error", error)
        }
    }



    getRepository() {
        if (this.hooksRepository) {
            return this.hooksRepository;
        }

    }
}
export default new HooksFactory();
