const { Router } = require('express');
const { body } = require('express-validator');
const authorization = require('../middlewares/authorization.js');
const commentController = require('../controllers/commentController.js');


const addCommentValidator = [
    body('content').notEmpty(),
    body('postid').notEmpty()
];

const modifyCommentValidator = [
    body('content').notEmpty()
];

const router = Router();

router.get('/comment', authorization, commentController.getAllComments);

router.get('/comment/:id', authorization, commentController.getComment);

router.post('/comment', authorization, addCommentValidator, commentController.addComment);

router.put('/comment/:id', authorization, modifyCommentValidator, commentController.modifyComment);

router.delete('/comment/:id', authorization, commentController.deleteComment);






module.exports = router;
