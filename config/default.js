const defer = require('config/defer').deferConfig;

module.exports = {
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
    redis: {
        port: isNaN(Number(process.env.REDIS_PORT)) ? 6379 : Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST || 'localhost',
        pass: process.env.REDIS_PASS || null
    },
    mongoose: {
        uri: `mongodb://${process.env.MONGOOSE_URI}/${process.env.MONGOOSE_DB_NAME}`,
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: false,
            dbName: process.env.MONGOOSE_DB_NAME,
            // user: process.env.MONGOOSE_USER,
            // pass: process.env.MONGOOSE_PASS,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            keepAlive: 120,
            keepAliveInitialDelay: 300000,
            poolSize: 10,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            promiseLibrary: global.Promise,
            bufferMaxEntries: 0
        }
    },

    nodemailer: {
        service: process.env.MAILER_SERVICE || 'gmail',
        host: process.env.MAILER_HOST || 'smtp-relay.gmail.com',
        port: isNaN(Number(process.env.MAILER_PORT)) ? 25 : Number(process.env.MAILER_PORT),
        secure: defer(cfg => {
            // true for 465, false for other ports on gmail
            return (Number(cfg.nodemailer.port) === 465 || Number(process.env.MAILER_PORT) === 465)
        }),
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    },
};