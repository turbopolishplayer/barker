const { Router } = require('express');
const signUp = require('../controllers/registraion.js').signUp
const { body } = require('express-validator');

const signUpValidator = [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
];

const router = Router();


router.post('/signup', signUpValidator, signUp);



module.exports = router;