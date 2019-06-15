const http   = require('http');
const path   = require('path');
const app    = new (require('koa'));
// const router = new (require('koa-router'));



const server = http.createServer(app.callback());


/* MIDDLEWARES */
[
    'static.js',
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