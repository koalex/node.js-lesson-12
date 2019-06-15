const bodyParser = require('koa-bodyparser');

module.exports = async (ctx, next) => {
    await bodyParser({ // application/x-www-form-urlencoded , application/json ONLY
        formLimit: '1mb',
        jsonLimit: '1mb',
        textLimit: '1mb'
    })(ctx, next);
};
