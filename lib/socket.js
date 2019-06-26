const socketIO   = require('socket.io');

function Socket (server) {
    const opts = {
        transports: ['websocket', 'polling'],
        serveClient: false,
        allowUpgrades: true,
        httpCompression: true,
        cookie: 'ws',
        cookiePath: '/',
        cookieHttpOnly: true,
        wsEngine: 'ws',
        maxHttpBufferSize: 10e7
    };

    const io = socketIO.listen(server, opts);

    /*const adapter = socketIORedis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
    });*/

    // io.adapter(adapter);

    io.on('connection', socket => {

        socket.on('error', console.error);


        socket.on('HELLO_FROM_CLIENT', message => {
            // socket.broadcast.emit('HELLO', {message: 'ПОДКЛЮЧИЛСЯ ' + socket.id});
            socket.volatile.broadcast.emit('HELLO', {message: 'ПОДКЛЮЧИЛСЯ ' + socket.id});
        });
    });

    Socket.io = io;
    return io;
}

module.exports = Socket;