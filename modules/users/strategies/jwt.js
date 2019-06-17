const JwtStrategy   = require('passport-jwt').Strategy;
const User          = require('../models/user');


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
    const token = req.headers['x-access-token'] || req.query.access_token || req.cookies.get('x-access-token');

    const userId = jwt_payload.user_id;

    try {
        const user = await User.findById(userId);

        if (!user) return done(null, false);

        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});