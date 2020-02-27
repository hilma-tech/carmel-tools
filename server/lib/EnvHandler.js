require('dotenv').config()

class EnvHandler {
    getHostName() {
        const hostName = process.env.NODE_ENV == 'production' ?
            process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : '.'
            : 'http://localhost:8080';
        return hostName;
    };

    getEnv() { return process.env.NODE_ENV; }

    isEnvLocal() {
        let env = process.env.NODE_ENV;
        if (env === "production" || env === "staging") return false;
        return true;
    }


    isEnvStaging() { return process.env.NODE_ENV === "staging" ? true : false; }

    isEnvProduction() { return process.env.NODE_ENV === "production" ? true : false; }
}

module.exports = new EnvHandler();