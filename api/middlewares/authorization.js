const jwt = require('jsonwebtoken');


const authorization = async function(req, res, next){
    try{
        const did = await jwt.verify(req.body.token, process.env.SECRET_KEY);
    }catch(err){
        next(err);
    }

    next();
        
}


module.exports = authorization;