const notifier = require('node-notifier');

module.exports = async (ctx, next) => {
    try {
        await next(); // message
    } catch (err) {

        if (process.env.NODE_ENV === 'development') {
            notifier.notify({
                title: 'Error',
                message: err.message,
                wait: true
            });
        }

        const report = {
            status: err.status,
            message: err.message,
            stack: err.stack,
            url: ctx.request.url,
            headers: ctx.request.headers,
            cookie: ctx.get('cookie')
        };

        ctx.log.error(report);

        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
};
