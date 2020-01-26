const path = require('path');
const router = require('express').Router();
const Log = require('../Models/Log');

class DefaultController {
    constructor(io) {
        this.io = io;
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
            // console.log("New Connection with transport", socket.conn.transport.name);
            // console.log('With handshake', socket.handshake);
            // console.log('With query', socket.handshake.query);

            socket.on('eventFromPhp',  (data) => {
                console.log('Data from Php', data, JSON.parse(data));
            });

            socket.on('+message', (data) => {
                console.log('+message', data);
            });

            socket.on('disconnect', () => {

            });
        });
    }

    index(req, res) {
        res.sendFile(path.resolve(__dirname + '/../template/index.html'));
    }

    ping(req, res) {
        const log = new Log({
            channel: 'nodejs-logger',
            level: 'INFO',
            message: 'OK',
            context: {}
        });

        this.io.emit('+message', log.serialize());
        res.send('OK');
    }

    log(req, res) {
        const data = req.body.log;

        try {
            const log = new Log(data);
            this.io.emit('+message', log.serialize());
            res.send('OK');
        } catch (e) {
            res.send('KO');
        }
    }
}

module.exports = DefaultController;
