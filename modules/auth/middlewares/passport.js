const passport = require('koa-passport');

passport.use('local', require('../strategies/local'));
passport.use('jwt', require('../strategies/jwt'));


module.exports = passport;