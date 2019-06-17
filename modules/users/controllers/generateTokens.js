const jwt = require('jsonwebtoken');


module.exports = function (user) {
    if (!user) throw new Error('User required.');

    const expiresIn = 5 * 60; // 5мин

    const KEY = process.env.KEYS;

    const access_token = jwt.sign({ user_id: user._id }, KEY, {
        // jwtid: ctx.req.headers['x-finger-print'],
        // issuer: 'http://jwtgenerate.com',
        // audience: 'https://drom.ru',
        // algorithm: 'HS512',
        expiresIn
    });

    const refresh_token = jwt.sign({ user_id: user._id }, KEY, {
        // issuer: 'http://localhost',
        // algorithm: 'HS512',
        expiresIn: 86400 * 60 // 60 дней
    });

    return {
        access_token,
        refresh_token,
        expires_in: new Date(Date.now() + expiresIn * 1000)
    }
};