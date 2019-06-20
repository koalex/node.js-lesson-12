require('dotenv').config();

const http    = require('http');
const path    = require('path');
const app     = new (require('koa'));
const KeyGrip = require('keygrip');
// const router = new (require('koa-router'));
const log      = require('./lib/logger');
const notifier = require('node-notifier');

app.keys = new KeyGrip([process.env.KEYS], 'sha256');

const server = http.createServer(app.callback());


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
    'bodyparser.js',
    'templates.js'
]
.map(mw => path.join(__dirname, 'middlewares', mw))
.forEach(mw => {
    app.use(require(mw));
});

/* MODULES */
require('./modules/users')(app);

server.listen(3000, () => {
    console.log('SERVER LISTENING ON PORT: 3000');
});