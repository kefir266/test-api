'use strict';
const User = require('../models/user');

function signIn(req, res) {

}

function signUp(req, res) {
  if (req.body.username && req.body.password) {
    const user = new User();
    user.create({ username: req.body.username, password: req.body.password })
      .then((result) =>
        res.json({ result }))
      .catch((err) => res.status(401).send(err));
  } else {
    res.status(400).send('Bad request');
  }
}

module.exports = {
  signIn,
  signUp
};