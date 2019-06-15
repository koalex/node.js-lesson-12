const http   = require('http');
const path   = require('path');
const app    = new (require('koa'));
// const router = new (require('koa-router'));
const log    = require('./lib/logger');


const server = http.createServer(app.callback());


process
    .on('unhandledRejection', err => {
        log.fatal(err);
        process.exit(1);
    })
    .on('uncaughtException', err => {
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
require('./modules/users')(app);

server.listen(3000, () => {
    console.log('SERVER LISTENING ON PORT: 3000');
});