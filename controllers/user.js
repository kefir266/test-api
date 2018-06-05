'use strict';
const User = require('../models/user');
const Auth = require('../auth');

function signIn(req, res) {
  if (req.body.username && req.body.password) {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          user.verifyCredential(req.body.password)
            .then((hash) => {
              if (hash) {
                return user._id;
              }
            })
            .then((id) => {
              const token = Auth.updateTocken(user);
              res.json({user, token});
            })
            .catch((err) => res.status(401).send(err));
        }
      });
  }
}

async function signUp(req, res) {
  if (req.body.username && req.body.password) {

    if (await User.isUserExist(req.body.username)) {
      res.status(401).send('User already exist');
    } else {
      const user = new User({ username: req.body.username, password: req.body.password });
      Auth.updateTocken(user)
       .then((result) =>
          res.json({ result }))
       .catch((err) => res.status(401).send(err));
    }
  } else {
    res.status(400).send('Bad request');
  }
}

function info(req, res, next) {
  res.json({ user: res.locals.user });
}

function logout(req, res, next) {
  const user = res.locals.user;
  const all = req.body.all === true || req.body.all === 'true' ;
  Auth.deleteToken(user, all)
    .then(() => res.json(user));
}

module.exports = {
  signIn,
  signUp,
  info,
  logout
};