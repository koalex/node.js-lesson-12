const User = require('../models/user');

module.exports = async function checkAuth (ctx, next) {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({ email: String(email) });

    if (!user) {
        return ctx.throw(400, 'пользователь не найден');
    }

    if (!user.checkPassword(password)) {
        return ctx.throw(400, 'пароль не правильный');
    }

    await next();
}