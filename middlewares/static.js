const serve = require('koa-static');
const path  = require('path');

module.exports = async (ctx, next) => {
    const staticPath = path.join(__dirname, '../static');

    return serve(staticPath, {
        maxAge: 0,
        gzip: true
    })(ctx, next);
};
