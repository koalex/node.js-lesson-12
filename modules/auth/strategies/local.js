const LocalStrategy = require('passport-local').Strategy;
const User          = require('../../users/models/user');

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, async function (email, password, done) {
    let user;

    try {
        user = await User.findOne({ email: String(email) });
    } catch (err) {
        return done(err);
    }

    if (!user) {
        return done(null, false, 'Пользователь не найден');
    }

    if (!user.active) {
        return done(null, false, 'Пользователь не активирован');
    }

    if (!user.checkPassword(password)) {
        return done(null, false, 'Пароль не правильный');
    }

    return done(null, user);
});