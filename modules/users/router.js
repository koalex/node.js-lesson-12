const fs        = require('fs');
const path      = require('path');
const Router    = require('koa-router');
const User      = require('./models/user');
const Message   = require('./models/message');
// const checkAuth = require('./middlewares/authLocal');
const passport  = require('koa-passport');
const genTokens = require('./controllers/generateTokens');

passport.use('local', require('./strategies/local'));

const apiRouter = new Router({
    prefix: '/api/v1'
});

const router = new Router();


router.get('/', /*checkAuth,*/ ctx => {

    /*if (!user) {
        return ctx.redirect('/signin');
    }*/

    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../static/home.html'));
});


router.get('/signin', /*checkAuth,*/ ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../static/signin.html'));
});

router.get('/signup', /*checkAuth,*/ ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../static/signup.html'));
});

apiRouter.get('/users', async ctx => {
    ctx.type = 'json';
    ctx.body = await User.find();
});

apiRouter.post('/signup', async ctx => {
    const user = new User(ctx.request.body);

    await user.save();

    ctx.redirect('/signin');
});

apiRouter.post('/signin', async ctx => {
    await passport.authenticate('local', async (err, user, info, status) => {
        if (err) {
            return ctx.throw(err);
        }

        if (!user) {
            return ctx.throw(500, info);
        }

        const tokens = genTokens(user);

        ctx.cookies.set('x-access-token', tokens.access_token, {
            // secure: true,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        ctx.cookies.set('x-refresh-token', tokens.refresh_token, {
            // secure: true,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        ctx.type = 'json';
        ctx.body = tokens;

        // ctx.redirect('/');
    })(ctx);
});

apiRouter.get('/messages', async ctx => {
    ctx.type = 'json';
    if (ctx.query.withUser) {
        ctx.body = await Message.find().populate('user_id');
    } else {
        ctx.body = await Message.find().lean().exec();
    }
});

apiRouter.post('/messages', /*checkAuth,*/ async ctx => {
    const message = new Message({
        message: ctx.request.body.message,
        user_id: user._id
    });

    await message.save();

    ctx.redirect('/');
});




module.exports = [
    router,
    apiRouter
];