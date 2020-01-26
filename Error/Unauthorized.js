class Unauthorized extends Error {
    constructor(message = 'Unauthorized', code = 401) {
        super();
        this.name = 'unauthorized';
        this.message = message;
        this.code = code;
    }
}

module.exports = Unauthorized;