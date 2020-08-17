const jwt = require('jsonwebtoken');


const authorization = async function(req, res, next){
    try{
        jwt.verify(req.body.token, process.env.SECRET_KEY);
    }catch(err){
        res.status(401);
        next(err);
    }

    next();
        
}


module.exports = authorization;