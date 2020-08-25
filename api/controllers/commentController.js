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
        res.json({
            message: "Comment has been added"
        });
    })
    .catch(err => {
        return next(err);
    });
    
}


const getComment = async function(req, res, next){
    
    commentModel.getComment(req.params.id)
    .then(result => {
        if(!result){
            res.status(404);
            return next(new Error(`This comment doesn't exist`));
        }
        res.json(result);
    })
    .catch(err => {
        return next(err);
    });

}


const getAllComments = async function(req, res, next){
    commentModel.getAllCommentsByPost(req.body.postid)
    .then(result => {
        if(!result.length){
            res.status(404);
            return next(new Error(`This post doesn't exist`));
        }
        res.json(result);
    })
    .catch(err => {
        return next(err);
    });

}


const modifyComment = async function(req, res, next){

    const errors = await validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const decodedJWT = await jwt.decode(req.body.token);

    commentModel.getComment(req.params.id)
    .then(result => {
        if(result === null){
            res.status(404);
            return next(new Error(`This post doesn't exist`));
        } 

        if(decodedJWT.email === result.ownerEmail){

            commentModel.modifyComment(req.params.id, req.body.content)
            .then(result => {
                res.json({
                    message: "Comment has been modified"
                });
            })
            .catch(err => {
                return next(err);
            });

        }else{
            res.status(401);
            return next(new Error("You have no permision to modify this comment"))
        }

    })
    .catch(err => {
        return next(err);
    });

}


const deleteComment = async function(req, res, next){

    const decodedJWT = await jwt.decode(req.body.token);

    commentModel.getComment(req.params.id)
    .then(result => {
        if(result === null){
            res.status(404);
            return next(new Error(`This post doesn't exist`));
        } 
        if(decodedJWT.email === result.ownerEmail){

            commentModel.deleteComment(req.params.id)
            .then(result => {
                res.json({
                    message: "Comment has been deleted"
                });
            })
            .catch(err => {
                return next(err);
            });

        }else{
            res.status(401);
            return next(new Error("You have no permision to delete this comment"))
        }
    })
    .catch(err => {
        return next(err);
    });
}



module.exports = {
    addComment,
    getComment,
    getAllComments,
    modifyComment,
    deleteComment
}