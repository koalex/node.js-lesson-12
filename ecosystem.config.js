module.exports = {
    apps : [{
        name: 'ЧАТ-СЕРВЕР',
        script: __dirname + '/server.js',
        env: {
            NODE_ENV: 'production',
        },
        instances: -1
    }]
};