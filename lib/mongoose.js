const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/users', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    keepAlive: 120,
    keepAliveInitialDelay: 300000,
    poolSize: 10,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    promiseLibrary: global.Promise,
    bufferMaxEntries: 0,
}).catch(err => {
    // логирование
    console.error(err);
});

mongoose.connection.on('connected', () => {
    console.info('Подключились к MongoDB');
});

mongoose.connection.on('error', err => {
    // логирование
    console.error(err);
});

mongoose.connection.on('disconnected', () => {
    console.info('Отключились от MongoDB');
});

process
    .on('SIGTERM', onSigintSigtermMessage('SIGTERM'))
    .on('SIGINT', onSigintSigtermMessage('SIGINT'))
    .on('message', onSigintSigtermMessage('message'));

function onSigintSigtermMessage (signal) {
    return function (msg) {
        if ('message' === signal && 'shutdown' !== msg) return; // windows
        console.info('Closing mongoose...');

        mongoose.connection.close(err => {
            if (err) {
                console.error(err);
                return process.exit(1);
            }
            process.exit(0);
        });
    }
}


module.exports = mongoose;
