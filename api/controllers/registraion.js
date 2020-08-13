const userModel = require('../models/user.js');
const { validationResult } = require('express-validator');

const signUp = async function(req, res){
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        res.send('hellobaby');
    }else{
        res.send('wrong')
    }
}


module.exports = {
    signUp
};