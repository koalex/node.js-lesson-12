const Router    = require('koa-router');
const messages  = require('./controllers/messages');
const passport  = require('../auth/middlewares/passport');

const apiRouter = new Router({
    prefix: '/api/v1'
});

const router = new Router();


apiRouter.get('/messages', passport.authenticate('jwt', {session: false}), messages.getAll);

apiRouter.get('/messages/:messageId', passport.authenticate('jwt', {session: false}), messages.getOne);

apiRouter.post('/messages', passport.authenticate('jwt', {session: false}), messages.create);

// СДЕЛАТЬ МЕТОД PUT


module.exports = [
    router,
    apiRouter
];