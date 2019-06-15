const Router    = require('koa-router');
const User      = require('./models/user');
const Message   = require('./models/message');
// const checkAuth = require('./middlewares/authLocal');
const passport  = require('koa-passport');

passport.use('local', require('./strategies/local'));

const apiRouter = new Router({
    prefix: '/api/v1'
});

apiRouter.get('/', ctx => {
    ctx.body = 'HELLO WORLD';
});

apiRouter.get('/users', async ctx => {
    ctx.type = 'json';
    ctx.body = await User.find();
});

apiRouter.post('/signup', async ctx => {
    const user = new User(ctx.request.body);

    await user.save();

    ctx.redirect('/');
});

apiRouter.post('/signin', async ctx => {
    await passport.authenticate('local', async (err, user, info, status) => {
        if (err) {
            return ctx.throw(err);
        }

        if (!user) {
            return ctx.throw(500, info);
        }

        ctx.body = 'Привет ' + user.name;
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
    apiRouter
];