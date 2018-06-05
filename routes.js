'use strict';

const router = require('express').Router();
const auth = require('./auth');
const contrUser = require('./controllers/user');
const bodyParser = require('body-parser');
//router.use(auth.isAuthenticated);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/signin', setHeaders, contrUser.signIn);
router.post('/signup', setHeaders, contrUser.signUp);
router.post(
  '/logout',
  auth.isAuthenticated,
  setHeaders,
  contrUser.logout);
router.get(
  '/info',
  auth.isAuthenticated,
  setHeaders,
  contrUser.info);

function setHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}

module.exports = router;