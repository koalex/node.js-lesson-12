require('dotenv').config();

const fs      = require('fs');
const http    = require('http');
const path    = require('path');
const app     = new (require('koa'));
const KeyGrip = require('keygrip');
const log      = require('./lib/logger');
const notifier = require('node-notifier');

app.keys = new KeyGrip([process.env.KEYS], 'sha256');

const server = http.createServer(app.callback());


try {
    fs.symlinkSync(__dirname + '/modules/users', __dirname + '/node_modules/users', 'dir');

} catch (e) {
    // LOG
}

try {
    fs.symlinkSync(__dirname + '/modules/auth', __dirname + '/node_modules/auth', 'dir');
} catch (e) {
    // LOG
}

try {
    fs.symlinkSync(__dirname + '/modules/messages', __dirname + '/node_modules/messages', 'dir');
} catch (e) {
    // LOG
}

process
    .on('unhandledRejection', err => {
        if (process.env.NODE_ENV === 'development') {
            notifier.notify({
                title: 'unhandledRejection',
                message: err.message,
                wait: true
            });
        }
        log.fatal(err);
        process.exit(1);
    })
    .on('uncaughtException', err => {
        if (process.env.NODE_ENV === 'development') {
            notifier.notify({
                title: 'uncaughtException',
                message: err.message,
                wait: true
            });
        }
        log.fatal(err);
        process.exit(1);
    });

/* MIDDLEWARES */
[
    'static.js',
    'log.js',
    'errHandler.js',
    'bodyparser.js'
]
.map(mw => path.join(__dirname, 'middlewares', mw))
.forEach(mw => {
    app.use(require(mw));
});

/* MODULES */
require('./modules/auth')(app);
require('./modules/users')(app);
require('./modules/messages')(app);

server.listen(3000, () => {
    console.log('SERVER LISTENING ON PORT: 3000');
});