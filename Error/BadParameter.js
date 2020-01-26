class BadParameter extends Error {
    constructor(message = 'Bad Parameter', code = 400) {
        super();
        this.name = 'bad_parameter';
        this.message = message;
        this.code = code;
    }
}

module.exports = BadParameter;
