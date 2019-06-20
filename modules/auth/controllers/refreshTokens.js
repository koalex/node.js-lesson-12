const jwt = require('jsonwebtoken');
const genTokens = require('./generateTokens');
const User      = require('../../users/models/user');
const BlackToken= require('../models/blacktoken');


module.exports = async ctx => {
    // const access_token  = ctx.headers['x-access-token'] || ctx.query.access_token || ctx.cookies.get('x-access-token');
    const refresh_token = ctx.headers['x-refresh-token'] || ctx.query.refresh_token || ctx.cookies.get('x-refresh-token');

    if (/*!access_token || */!refresh_token) {
        return ctx.throw(401, 'Refresh токен отсутствует');
    }

    // const blackAccessToken  = new BlackToken({token: access_token});
    const blackRefreshToken = new BlackToken({token: refresh_token});

    try {
        const payload = jwt.verify(refresh_token, process.env.KEYS, {
            ignoreExpiration: false
        });

        await Promise.all([/*blackAccessToken.save(), */blackRefreshToken.save()]);


        const user = await User.findById(payload.user_id).lean().exec();

        const newTokens = genTokens(user);

        ctx.cookies.set('x-access-token', newTokens.access_token, {
            expires: new Date(Date.now() + 5 * 60 * 1000), // время жизни токена
            secure: ctx.secure,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        ctx.cookies.set('x-refresh-token', newTokens.refresh_token, {
            expires: new Date(Date.now() + 86400 * 60 * 1000), // время жизни refresh токена
            secure: ctx.secure,
            httpOnly: true,
            signed: true,
            origin: (new URL(ctx.href)).origin
        });

        ctx.type = 'json';

        ctx.body = newTokens;
    } catch (e) {
        ctx.cookies.set('x-access-token', null);
        ctx.cookies.set('x-refresh-token', null);

        return ctx.throw(401, 'Ошибка при валидации refresh токена');
    }
};