const errorHandler = function(err, req, res, next){
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        method: req.method
    });
}


module.exports = errorHandler;