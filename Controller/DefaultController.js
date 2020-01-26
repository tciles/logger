const path = require('path');
const router = require('express').Router();
const Log = require('../Models/Log');
const Unauthorized = require('../Error/Unauthorized');

class DefaultController {
    constructor(io) {
        this.io = io;
        this.users = {};
        this.tokens = {};

        this.addSocketEvents(this.io);
    }

    getRouter() {
        router.get('/', this.index.bind(this));
        router.get('/ping', this.ping.bind(this));
        router.post('/log', this.log.bind(this));

        return router;
    }

    addSocketEvents(io) {
        io.on('connection', (socket) => {
            socket.use((packet, next) => {
                const auth = socket.request.headers.authorization;
                const user = socket.request.headers.user;

                if (auth && user) {
                    const token = auth.replace("Bearer ", "");

                    if (!this.tokens[token] && !this.users[token]) {
                        this.tokens[token] = socket.id;
                        this.users[token] = user;
                    }

                    return next();
                } else {
                    const err = new Unauthorized();

                    const log = new Log({
                        channel: 'nodejs-logger',
                        level: 'ERROR',
                        message: 'Connection error : ' + err.toLocaleString(),
                        context: {user, auth}
                    });

                    this.io.emit('+message', log.serialize());

                    return next(err);
                }
            });

            // const xMyHeader = socket.handshake.headers['x-my-header'];

            const log = new Log({
                channel: 'nodejs-logger',
                level: 'INFO',
                message: 'connection',
                context: {
                    transport: socket.conn.transport.name,
                    handshake: socket.handshake,
                    query: socket.handshake.query,
                }
            });

            this.io.emit('+message', log.serialize());

            socket.on('+message', (data) => {
                const log = new Log(data);
                this.io.emit('+message', log.serialize());
            });

            socket.on('disconnect', () => {});
        });
    }

    index(req, res) {
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    }

    ping(req, res) {
        const log = new Log({
            channel: 'nodejs-logger',
            level: 'INFO',
            message: 'OK',
            context: {}
        });

        this.io.emit('+message', log.serialize());

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: 'OK'}));
    }

    log(req, res) {
        const data = req.body;
        const log = new Log(data);
        this.io.emit('+message', log.serialize());

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: 'OK'}));
    }
}

module.exports = DefaultController;
