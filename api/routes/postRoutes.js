const { Router } = require('express');
const { body } = require('express-validator');
const authorization = require('../middlewares/authorization.js');
const postController = require('../controllers/postController.js')

const router = Router();

const addPostValidator = [
    body('content').notEmpty()
];

// const modifyPostValidator = [
//     body('token').notEmpty(),
// ]

router.post('/post', authorization, addPostValidator, postController.addPost);

router.get('/post/:id', authorization, postController.getPost);

router.get('/post', authorization, postController.getPosts);

router.put('/post/:id', authorization, postController.updatePost);

router.delete('/post/:id', authorization, postController.deletePost);

module.exports = router;
