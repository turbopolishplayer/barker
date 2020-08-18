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
        next(err);
    });
}



const getPost = async function(req, res, next){

    postModel.getPost(req.params.id)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        next(err);
    });
}



const getAllPost = async function(req, res, next){

    const decodedJWT = jwt.decode(req.body.token);

    postModel.getAllPost(decodedJWT.email)
    .then(result => {
        console.log(req.query.page, req.query.per_page)
        if(req.query.page && req.query.per_page){
            const offset = (req.query.page * req.query.per_page) - req.query.per_page
            result = result.splice(offset , offset+req.query.per_page);
        }
        
        res.json(result);
    })
    .catch(err => {
        next(err);
    });

}


const updatePost = async function(req, res, next){

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            errors: errors.array()
        });
    }

    const decodedJWT = jwt.decode(req.body.token);


    postModel.updatePost(decodedJWT.email, req.body.postid, req.body.content)
    .then(result => {
        if(!result) throw new Error('Something bad with updating');

        res.json({
            message: "Post has beed updated"
        });
    })
    .catch(err => {
        res.status(404);
        next(err);
    });

}


module.exports = {
    addPost,
    getPost,
    getAllPost,
    updatePost
}