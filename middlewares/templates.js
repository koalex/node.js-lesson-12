const pug  = require('pug');
const path = require('path');

module.exports = async (ctx, next) => {
    ctx.render = function (pathToFile, locals) {

        return ctx.body = pug.renderFile(path.normalize(pathToFile), locals);
    };

    await next();
};

