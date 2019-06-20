const Router    = require('koa-router');
const User      = require('./models/user');



const apiRouter = new Router({
    prefix: '/api/v1'
});

const router = new Router();



module.exports = [
    router,
    apiRouter
];