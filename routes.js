'use strict';

const router = require('express').Router();
const auth = require('./auth');
const contrUser = require('./controllers/user');

router.use(auth.isAuthenticated);

router.post('/signin', contrUser.signIn);

module.exports = router;