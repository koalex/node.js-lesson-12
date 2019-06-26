const socketIO   = require('socket.io');
// const Cookies    = require('cookies');
// const jwt        = require('jsonwebtoken');
// const User       = require('users/models/user');
// const BlackToken = require('auth/models/blacktoken');

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

    // io.use(async (socket, next) => {
    //     const tokens = getTokensFromSocket(socket);
    //     const denied = await BlackToken.findOne({$or: [{token: String(tokens.access_token)}, {token: String(tokens.refresh_token)}]}).lean().exec();
    //
    //     if (denied) {
    //         return next(new Error('Authentication error'));
    //     }
    //
    //     try {
    //         const userId = jwt.verify(tokens.access_token, process.env.SECRET).user_id;
    //
    //         const user = await User.findById(userId);
    //
    //         if (!user || !user.active) {
    //             return next(new Error('Authentication error'));
    //         }
    //
    //         socket.user = user;
    //
    //     } catch (e) {
    //         return next(new Error('Authentication error'));
    //     }
    //
    //     next()
    // });

    io.on('connection', socket => {
        console.log('КТО-ТО ПОДКЛЮЧИЛСЯ');

        socket.on('error', console.error);


        // io.emit('HELLO', {message: 'ПОДКЛЮЧИЛСЯ ' + socket.id});

        /*socket.use((packet, next) => {
            console.log('СРАБОТАЛ CALLBACK socket.use');
            console.log('token =', socket.client.request.headers.cookie)
            const err = new Error('No auth');
            // socket.disconnect();

            next(err);
        });*/

        socket.on('HELLO_FROM_CLIENT', message => {
            // socket.broadcast.emit('HELLO', {message: 'ПОДКЛЮЧИЛСЯ ' + socket.id});
            socket.volatile.broadcast.emit('HELLO', {message: 'ПОДКЛЮЧИЛСЯ ' + socket.id});
        });

        // setInterval(function () {
        //     io.emit('HELLO', {message: 'ПРИВЕТ МИР'});
        // }, 1000)
    });

    Socket.io = io;
    return io;
}

/*function getTokensFromSocket (socket) {
    const handshakeData = socket.request; // http(s) request
    const cookies       = new Cookies(handshakeData, {}, {keys: process.env.KEYS});
    const tokens        = {};

    tokens.access_token  = cookies.get('x-access-token');
    tokens.refresh_token = cookies.get('x-refresh-token');

    return tokens;
}*/

module.exports = Socket;