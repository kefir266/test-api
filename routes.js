'use strict';

const router = require('express').Router();
const auth = require('./auth');
const contrUser = require('./controllers/user');
const bodyParser = require('body-parser');
//router.use(auth.isAuthenticated);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/signin', contrUser.signIn);
router.post('/signup', contrUser.signUp);

module.exports = router;