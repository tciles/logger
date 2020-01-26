const errorHandler = (err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    let error_id = 400;
    let error_name = 'bad_request';
    let error_description = 'Bad Request';

    if (err.hasOwnProperty('code')) {
       error_id = err.code;
    }

    if (err.hasOwnProperty('message')) {
        error_description = err.message;
    }

    if (err.hasOwnProperty('name')) {
        error_name = err.name;
    }

    if (typeof err === "string") {
        error_description = err;
    }

    res.send(JSON.stringify({
        error_id,
        error_name,
        error_description
    }));
};

module.exports = errorHandler;
