const notFound = function(req, res, next){
    const error = new Error(`Not Found - ${req.url}`);
    res.status(404);
    next(error);
}



module.exports = notFound;