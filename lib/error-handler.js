function getErrorHandler(log = console.log){
    //eslint-disable-next-line
    return function errorHandler(err, req, res, next){
        let code, error;

        if(err.code){
            code = err.code;
            error = err.error;
        }
        else {
            code = 500;
            error = 'Internal Server Error';
            log(err);
        }
        
        res.status(code).send({ error });
    };

}

module.exports = getErrorHandler;