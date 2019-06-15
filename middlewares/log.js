const logger = require('../lib/logger');


module.exports = async (ctx, next) => {
    ctx.log = logger.child({
        requestId: Math.random()
    });

    await next();
};

