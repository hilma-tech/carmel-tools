'use strict';

import HooksRepository from './HooksRepository'

 class HooksFactory {
    hooksRepository = null;
    constructor() {
        this.hooksRepository = new HooksRepository();
        
        let modulesList =require("./modulesList.json").modulesList;

        let m = null;
        modulesList.forEach((moduleName) => {

            let moduleInstance = null;

            try {
                moduleInstance = require(`./../../../${moduleName}/consts/HooksList`).default;
                 new moduleInstance(this.hooksRepository).addHooks()

            } catch (err) {
                console.log("err", err)
            }

        })



    }
    getRepository() {
        return this.hooksRepository;

    }
}
export default new HooksFactory();
