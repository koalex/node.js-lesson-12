const JwtStrategy   = require('passport-jwt').Strategy;
const User          = require('../../users/models/user');
const BlackToken    = require('../models/blacktoken');
// const jwt           = require('jsonwebtoken');

const opts = {
    // issuer: 'http://jwtgenerate.com',
    // audience: 'https://drom.ru',
    passReqToCallback: true,
    secretOrKey: process.env.KEYS,
    ignoreExpiration: false,
    jwtFromRequest: req => {
        const token = req.headers['x-access-token'] || req.query.access_token || req.cookies.get('x-access-token');

        return token;
    }
};


module.exports = new JwtStrategy(opts, async (req, jwt_payload, done) => {
    const access_token  = req.headers['x-access-token'] || req.query.access_token || req.cookies.get('x-access-token');
    const refresh_token = req.headers['x-refresh-token'] || req.query.refresh_token || req.cookies.get('x-refresh-token');

    const denied = await BlackToken.findOne({$or: [{token: access_token}, {token: refresh_token}]});

    if (denied) {
        return done(null, false);
    }

    /*try {
        jwt.verify(access_token, process.env.KEYS, {
            jwtid: req.headers['x-finger-print']
        });
    } catch (e) {
        return done(null, false);
    }*/
    const userId = jwt_payload.user_id;

    try {
        const user = await User.findById(userId);

        if (!user) return done(null, false);

        if (!user.active) {
            return done(null, false, 'Пользователь не активирован');
        }

        if (!req.state) req.state = {};
        req.state.user = user;

        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});