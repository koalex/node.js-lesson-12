const fs        = require('fs');
const path      = require('path');
const Router    = require('koa-router');
const passport  = require('./middlewares/passport');
const auth      = require('./controllers/auth');

const router = new Router();
const apiRouter = new Router({
    prefix: '/api/v1'
});


router.get('/', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/signin'
}), ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../static/home.html'));
});

router.get('/signin', auth.signinGet);

apiRouter.post('/signin', auth.signinPost);

router.get('/signup', auth.signupGet);


apiRouter.post('/signup', auth.signupPost);

apiRouter.get('/user-activation', async ctx => {

});

apiRouter.post('/signout', passport.authenticate('jwt', {session: false}), auth.signoutPost);

router.get('/me', passport.authenticate('jwt', {session: false}), async ctx => {
    ctx.type = 'json';
    ctx.body = ctx.state.user;
});

apiRouter.get('/refresh-tokens', require('./controllers/refreshTokens'));


module.exports = [
    router,
    apiRouter
];