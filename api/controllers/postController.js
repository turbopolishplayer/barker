const jwt = require('jsonwebtoken');
const postModel = require('../models/post.js');
const { validationResult } = require('express-validator');


const addPost = async function(req, res, next){

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            errors: errors.array()
        });
    }

    const decodedJWT = jwt.decode(req.body.token)

    postModel.addPost(decodedJWT.email, req.body.content)
    .then(result => {
        if(result){
            res.json({
                message: "Post has been added"
            });
        }
    })
    .catch(err => {
        next(err);
    });
}


module.exports = {
    addPost,

}