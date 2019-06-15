const Router  = require('koa-router');
const User    = require('./models/user');
const Message = require('./models/message');

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

apiRouter.post('/users', async ctx => {
    const user = new User(ctx.request.body);

    await user.save();

    ctx.redirect('/');
});

apiRouter.get('/messages', async ctx => {
    ctx.type = 'json';
    if (ctx.query.withUser) {
        ctx.body = await Message.find().populate('user_id');
    } else {
        ctx.body = await Message.find().lean().exec();
    }
});

apiRouter.post('/messages', async ctx => {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({ email: String(email) });

    if (!user) {
        ctx.log.error({
            status: 400,
            message: 'пользователь не найден',
            url: ctx.request.url,
            ...ctx.request.body
        });
        return ctx.throw(400, 'пользователь не найден');
    }

    if (!user.checkPassword(password)) {
        ctx.log.error({
            status: 400,
            message: 'пароль не правильный',
            url: ctx.request.url,
            ...ctx.request.body
        });
        return ctx.throw(400, 'пароль не правильный');
    }

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