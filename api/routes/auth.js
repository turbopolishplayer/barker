const { Router } = require('express');
const signUp = require('../controllers/auth.js').signUp;
const signIn = require('../controllers/auth.js').signIn;
const { body } = require('express-validator');

const signUpValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
];

const router = Router();


router.post('/signup', signUpValidator, signUp);
router.post('/signin', signIn);



module.exports = router;