const { Router } = require('express');
const { body } = require('express-validator');
const authorization = require('../middlewares/authorization.js');
const postController = require('../controllers/postController.js')

const router = Router();

const addPostValidator = [
    body('token').notEmpty(),
    body('content').notEmpty()
];

const modifyPostValidator = [
    body('token').notEmpty(),
    body('postid').notEmpty()
]

router.post('/post', authorization, addPostValidator, postController.addPost);

router.get('/post', authorization, postController.getAllPost);

router.put('/post', authorization, modifyPostValidator, postController.updatePost);

module.exports = router;
