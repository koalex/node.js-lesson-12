const fs        = require('fs');
const passport  = require('../middlewares/passport');
const path      = require('path')

const User       = require('users/models/user');
const BlackToken = require('../models/blacktoken');

const genTokens  = require('./generateTokens');
const uuidv1     = require('uuid/v1');
const nodemailer = require('../../../lib/nodemailer');


exports.signinGet = async ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../../static/signin.html'));
};


exports.signinPost = async ctx => {
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
};

exports.signupGet = async ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../../static/signup.html'));
};

exports.signupPost = async ctx => {
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
};

exports.userActivationGet = async ctx => {
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
};


exports.signoutPost = async ctx => {
    const access_token  = ctx.headers['x-access-token'] || ctx.query.access_token || ctx.cookies.get('x-access-token');
    const refresh_token = ctx.headers['x-refresh-token'] || ctx.query.refresh_token || ctx.cookies.get('x-refresh-token');

    const blackAccessToken = new BlackToken({token: access_token});
    const blackRefreshToken = new BlackToken({token: refresh_token});

    await Promise.all([blackAccessToken.save(), blackRefreshToken.save()]);

    ctx.cookies.set('x-access-token', null);
    ctx.cookies.set('x-refresh-token', null);

    ctx.redirect('/signin');
};











