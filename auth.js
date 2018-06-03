'use strict';
const jwt = require('jwt-simple');
const User = require('./models/user');

const ALGORITHM = 'HS512';

async function isAuthenticated(req, res, next) {

  let payload;
  let token;
  try {
    token = req.headers.authorization.split(' ');
    if (token.length === 2 ) {
      payload = await jwt.decode(token[1], process.env.JWT_SECRET, false, ALGORITHM);
      if ( +new Date > payload.expiration) {
        throw 'Token expired';
      }
    } else {
      throw 'Not authorized';
    }
  } catch(err) {
    res.status(401).send(err);
    return;
  }
  const username = payload.username;
  const user = await User.isUserExist(username);
  if (user) {
    if (user.token === token) {
      res.locals.user = user;
      await updateTocken(user);
      next();
      return;
    }
  }
  res.status(401).send('Not authorized');
}

function updateTocken(user){
  const expiration = +new Date() + 6000000;
  const payload = { id: user.id, username: user.username, expiration };
  user.token = jwt.encode(payload, process.env.JWT_SECRET, ALGORITHM);
  return user.save();
}

function deleteToken(user) {
  user.token = '';
  user.save();
}
module.exports = {
  isAuthenticated,
  updateTocken
};