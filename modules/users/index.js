const router = require('./router');

module.exports = function (app) {
    router.forEach(router => {
        app.use(router.routes());
    });
};