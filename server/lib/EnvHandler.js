require('dotenv').config()

class EnvHandler {
    getHostName() {


        const hostName = !this.isEnvLocal() ?
            process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : '.'
            : 'http://localhost:8080';

        console.log("HOST", hostName);
        console.log("ENVS", process.env.NODE_ENV);
        return hostName;
    };

    getEnv() { return process.env.NODE_ENV; }

    isEnvLocal() {
        let env = process.env.NODE_ENV;
        if (!env || env === "" || env === "development") return true;
        return false;
    }

    isEnvStaging() { return process.env.NODE_ENV === "staging" ? true : false; }

    isEnvProduction() { return process.env.NODE_ENV === "production" ? true : false; }
}

module.exports = new EnvHandler();
