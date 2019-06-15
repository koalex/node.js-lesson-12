

module.exports = async (ctx, next) => {
    try {
        await next(); // message
    } catch (err) {
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
