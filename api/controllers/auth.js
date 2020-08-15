const userModel = require('../models/user.js');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user.js');

const signUp = async function(req, res){
    const errors = validationResult(req);
    if(errors.isEmpty()) 
    {
        userModel.createUser(req.body.email, req.body.name, req.body.lastname, req.body.password)
        .then((result) =>{
            res.json({
                message: "User Added Succesfully"
            });
        })
        .catch(err => {
            res.status(409).json({
                error: err.message
            });
        });

    }else{
        res.status(400).json({
            errors: errors.array()
        });
    }
}

const signIn = async function(req, res, next){
    userModel.getUserByEmail(req.body.email)
    .then(user => {
        bcrypt.compare(req.body.password, user.password)
        .then(async result => {
            if(!result) {
                res.status(404)
                next(new Error('Wrong credentials'));
            }else{
                const noPasswordUser = await userModel.getUserByEmailWithoutPassword(req.body.email);
                const token = jwt.sign(noPasswordUser, process.env.SECRET_KEY);
                res.json({
                    token: token
                });
            }
        })
        .catch(err => {
            next(err);
        });

    })
    .catch(err =>{
        next(err);
    });
}


module.exports = {
    signUp,
    signIn
};
