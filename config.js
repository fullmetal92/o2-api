/**
 * Project O2 Configuration
 */

const config = {

    // Production
    production: {

        api: {
            baseUrl: 'https://json.astrologyapi.com/v1',
            username: '4545',
            password: 'f9b007c05c0df06c0df3082b9a965119',
            endpoints: {
                manglik: '/manglik'
            }
        },

        database: {
            name: '',
            username: '',
            password: ''
        },

        security: {
            jwt: {
                scheme: 'JWT',
                secret: 'mySecret',
                issuer: 'localhost',
                audience: 'localhost',
                expiresIn: '5m' // expires in 5 minutes (See: https://github.com/zeit/ms)
            }
        },

        logger: {
            dirName: 'logs',
            extension: '.log',
            dateFormat: 'DD-MM-YYYY'
        }
    },
    default: {

        api: {
            baseUrl: 'https://json.astrologyapi.com/v1',
            username: '4545',
            password: 'f9b007c05c0df06c0df3082b9a965119',
            endpoints: {
                manglik: '/manglik'
            }
        },

        database: {
            url: 'mongodb://127.0.0.1:27017/astro-db',
            options: {
                user: 'dev-db-user',
                pass: '5Bc8rCfxuoUhNjt7'
            }
        },

        security: {
            jwt: {
                scheme: 'JWT',
                secret: 'mySecret',
                issuer: 'localhost',
                audience: 'localhost',
                expiresIn: '60m' // expires in 5 minutes (See: https://github.com/zeit/ms)
            }
        },

        logger: {
            dirName: 'logs',
            extension: '.log',
            dateFormat: 'DD-MM-YYYY'
        }
    }
};

exports.get = function get(env) {
    return config[env] || config.default;
};
