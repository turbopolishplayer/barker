const { Router } = require('express');
const { body } = require('express-validator');
const authorization = require('../middlewares/authorization.js');
const postController = require('../controllers/postController.js')

const router = Router();

const signUpValidator = [
    body('token').notEmpty(),
    body('content').notEmpty()
];

router.post('/post', authorization, signUpValidator, postController.addPost);

module.exports = router;
