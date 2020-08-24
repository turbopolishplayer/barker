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

    const decodedJWT = jwt.decode(req.body.token);

    postModel.addPost(decodedJWT.email, req.body.content)
    .then(result => {
        if(result){
            res.json({
                message: "Post has been added"
            });
        }
    })
    .catch(err => {
        return next(err);
    });
}



const getPost = async function(req, res, next){

    postModel.getPost(req.params.id)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        return next(err);
    });
}



const getPosts = async function(req, res, next){

    const decodedJWT = jwt.decode(req.body.token);

    postModel.getAllPost(decodedJWT.email)
    .then(result => {
        if(req.query.page && req.query.per_page){

            const offset = (req.query.page * req.query.per_page) - req.query.per_page;
            result = result.slice(offset, offset + (+req.query.per_page));

        }
        res.json(result);
    })
    .catch(err => {
        return next(err);
    });

}


const updatePost = async function(req, res, next){

    const decodedJWT = jwt.decode(req.body.token);


    postModel.updatePost(decodedJWT.email, req.params.id, req.body.content)
    .then(result => {
        if(!result) throw new Error('Something bad with updating');

        res.json({
            message: "Post has beed updated"
        });
    })
    .catch(err => {
        res.status(404);
        return next(err);
    });

}

const deletePost = async function(req, res, next){

    const decodedJWT = await jwt.decode(req.body.token);
    
    let post;
    
    try{
        post = await postModel.getPost(req.params.id);
    }catch(err){
        res.status(404);
        return next(err);
    }

    if(decodedJWT.email === post.owner){
        postModel.deletePost(req.params.id)
        .then(result => {
            res.json({
                message: 'Post has been deleted'
            })
        })
        .catch(err => {
            next(err);
        });

    }else{
        res.status(401);
        return next(new Error('No permission to delete this post'));
    }


}


module.exports = {
    addPost,
    getPost,
    getPosts,
    updatePost,
    deletePost
}