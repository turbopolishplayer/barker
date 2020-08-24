const jwt = require('jsonwebtoken');
const commentModel = require('../models/comment.js');
const postModel = require('../models/post.js')
const { validationResult } = require('express-validator');
const comment = require('../models/comment.js');



const addComment = async function(req, res, next){

    const errors = await validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const decodedJWT = await jwt.decode(req.body.token);

    commentModel.addComment(decodedJWT.email, req.body.postid, req.body.content)
    .then(result => {

        postModel.asingCommentToPost(req.body.postid, result.insertedId.toString())
        .then(result => {
            res.json({
                message: "Comment has been added"
            });
        })
        .catch(err => {
            return next(err);
        });

    })
    .catch(err => {
        return next(err);
    });
    
}


const getComment = async function(req, res, next){
    


}


const getAllComments = async function(req, res, next){
    commentModel.getAllCommentsByPost(req.body.postid)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        return next(err);
    });

}



module.exports = {
    addComment,
    getComment,
    getAllComments,
}