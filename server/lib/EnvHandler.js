require('dotenv').config()

class EnvHandler {
    getHostName () {
        const hostName = process.env.NODE_ENV == 'production' ?
            process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : '.'
            : 'http://localhost:8080';
        return hostName;
    };
}

module.exports = new EnvHandler();