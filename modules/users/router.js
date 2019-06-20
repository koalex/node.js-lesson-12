require('dotenv').config();
const fs        = require('fs');
const path      = require('path');
const Router    = require('koa-router');
const User      = require('./models/user');
const Message   = require('./models/message');
const BlackToken= require('./models/blacktoken');
// const checkAuth = require('./middlewares/authLocal');
const passport  = require('koa-passport');
const genTokens = require('./controllers/generateTokens');
const crypto   = require('crypto');

passport.use('local', require('./strategies/local'));
passport.use('jwt', require('./strategies/jwt'));

const apiRouter = new Router({
    prefix: '/api/v1'
});

const router = new Router();


router.get('/', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/signin'
}), ctx => {

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

apiRouter.get('/users', passport.authenticate('jwt', {session: false}), async ctx => {
    ctx.type = 'json';
    ctx.body = await User.find();
});

const uuidv1 = require('uuid/v1');
const nodemailer = require('../../lib/nodemailer');
apiRouter.post('/signup', async ctx => {
    const user = new User(ctx.request.body);

    user.activation_token = uuidv1();

    await new Promise((resove, reject) => {
        nodemailer.sendMail({
            from: 'nodejs@mail.com',
            to: 'nodemailerservice2019@gmail.com',
            subject: 'Проверка',
            // text: 'Привет мир',
            html: `<a href="http://localhost:3000/api/v1/user-activation?activationToken=${user.activation_token}">ПОДТВЕРДИТЕ РЕГИСТРАЦИЮ</a>`
        }, (err, info) => {
            if (err) return reject(err);

            resove(info);
        });
    });

    await user.save();

    ctx.redirect('/signin');
});

// REST
// GET /users
// GET /users/1
// GET /users/1/name
// GET /users/1?field=name
// POST /users
// PUT /users/1
// DELETE /users/1
// PATCH /users/1/name

apiRouter.get('/user-activation', async ctx => {
    if (ctx.query && ctx.query.activationToken) {
        const user = await User.findOne({activation_token: String(ctx.query.activationToken)});

        if (!user) {
            return ctx.throw(500, 'Пользователь не найден');
        }

        if (user.active) {
            return ctx.throw(500, 'Пользователь уже активирован');
        }

        user.active = true;

        await user.save();

        ctx.redirect('/signin');
    } else {
        ctx.throw(400, 'токен не найден');
    }


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
            expires: new Date(Date.now() + 5 * 60 * 1000), // время жизни токена
            secure: ctx.secure,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        ctx.cookies.set('x-refresh-token', tokens.refresh_token, {
            expires: new Date(Date.now() + 86400 * 60 * 1000), // время жизни refresh токена
            secure: ctx.secure,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        // ctx.type = 'json';
        // ctx.body = tokens;

        ctx.redirect('/');
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

apiRouter.get('/messages/:messageId', passport.authenticate('jwt', {session: false}), async ctx => {

    try {
        const message = await Message.findOne({_id: String(ctx.params.messageId)}).lean().exec();

        ctx.render(__dirname + '/../../tmpl/message_editor.pug', {
            message: message,
        });
    } catch (err) {
        ctx.throw(400, 'сообщение не найдено');
    }
});

apiRouter.put('/messages/:messageId', passport.authenticate('jwt', {session: false}), async ctx => {
    let message;

    try {
        message = await Message.findOne({_id: String(ctx.params.messageId)}).lean().exec();
    } catch (err) {
        ctx.throw(400, 'сообщение не найдено, нечего редактировать');
    }

    if (String(message.user_id) !== String(ctx.state.user._id)) {
        ctx.throw(400, 'Это не ваше сообщение');
    }

    await Message.updateOne({_id: String(ctx.params.messageId)}, {$set: {message: String(ctx.request.body.message)}},
        {runValidators: true});

    ctx.redirect('/api/v1/messages/' + String(ctx.params.messageId));
});

apiRouter.delete('/messages/:messageId', passport.authenticate('jwt', {session: false}), async ctx => {
    let message;

    try {
        message = await Message.findOne({_id: String(ctx.params.messageId)}).lean().exec();
    } catch (err) {
        ctx.throw(400, 'сообщение не найдено, нечего удалять');
    }

    if (String(message.user_id) !== String(ctx.state.user._id)) {
        ctx.throw(400, 'Это не ваше сообщение');
    }

    await Message.deleteOne({_id: String(ctx.params.messageId)});

    ctx.type = 'text/plain';
    ctx.body = 'Сообщение удалено!';
});


apiRouter.post('/messages', passport.authenticate('jwt', {session: false}), async ctx => {
    const message = new Message({
        message: ctx.request.body.message,
        user_id: ctx.state.user._id
    });

    await message.save();

    ctx.redirect('/');
});

apiRouter.post('/signout', passport.authenticate('jwt', {session: false}), async ctx => {
    const access_token  = ctx.headers['x-access-token'] || ctx.query.access_token || ctx.cookies.get('x-access-token');
    const refresh_token = ctx.headers['x-refresh-token'] || ctx.query.refresh_token || ctx.cookies.get('x-refresh-token');

    const blackAccessToken = new BlackToken({token: access_token});
    const blackRefreshToken = new BlackToken({token: refresh_token});

    await Promise.all([blackAccessToken.save(), blackRefreshToken.save()]);

    ctx.cookies.set('x-access-token', null);
    ctx.cookies.set('x-refresh-token', null);

    ctx.redirect('/signin');
});

router.get('/me', passport.authenticate('jwt', {session: false}), async ctx => {
    ctx.type = 'json';
    ctx.body = ctx.state.user;
});

apiRouter.get('/refresh-tokens', require('./controllers/refreshTokens'));

router.get('/password', passport.authenticate('jwt', {session: false}), ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../static/password.html'));
});

apiRouter.put('/updatePassword', passport.authenticate('jwt', {session: false}), async ctx => {

    const user = ctx.state.user;

    if (user.password_hash !== String(crypto.pbkdf2Sync(ctx.request.body.current_password, user.salt, 12000, 128, 'sha512'))) {
        ctx.throw(400, 'Неправильный старый пароль');
    }

    user.password = String(ctx.request.body.new_password);

    await user.save();

    new Promise((resove, reject) => {
        nodemailer.sendMail({
            from: process.env.TEST_EMAIL_FROM,
            to: process.env.TEST_EMAIL_FOR_NOTIFICATION,
            subject: 'Проверка обновления пароля',
            html: `<p>ваш пароль был обновлен ${new Date()}</p>`
        }, (err, info) => {
            if (err) return reject(err);

            resove(info);
        });
    });

    ctx.redirect('/signin');
});


module.exports = [
    router,
    apiRouter
];