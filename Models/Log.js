const uuidv1 = require('uuid/v1');

class Log {
    constructor(parameters) {
        if (typeof parameters !== "object") {
            throw new Error();
        }

        if (!parameters.hasOwnProperty('channel')) {
            throw new Error();
        }
        if (!parameters.hasOwnProperty('level')) {
            throw new Error();
        }

        this._uuid = uuidv1();
        this._timestamp = parameters.timestamp || (new Date().getTime());
        this._channel = parameters.channel;
        this._level = parameters.level.toUpperCase();
        this._message = parameters.message;
        this._context = parameters.context;
    }

    get uuid() {
        return this._uuid;
    }

    set uuid(value) {
        this._uuid = value;
    }

    get timestamp() {
        return this._timestamp;
    }

    set timestamp(value) {
        if (!value) {
            this._timestamp = (new Date().getTime());
        } else {
            this._timestamp = value;
        }
    }

    get channel() {
        return this._channel;
    }

    set channel(value) {
        this._channel = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }

    serialize() {
        return JSON.stringify({
            uuid: this._uuid,
            timestamp: this._timestamp,
            channel: this._channel,
            level: this._level,
            message: this._message,
            context: this._context,
        });
    }
}

module.exports = Log;
