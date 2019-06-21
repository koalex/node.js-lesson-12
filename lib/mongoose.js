const config   = require('config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoose.uri, config.mongoose.options).catch(err => {
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
