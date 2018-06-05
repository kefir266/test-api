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
    User.findOne({ username }, 'tokens')
      .then(result => {
        const tokens = result.tokens.filter(function (current) {
          return current.token === token;
        });
        if (tokens.length) {
          user.tiken = tokens[0];
          res.locals.user = user;
          updateTocken(user);
          next();
        }
      })
    }
  res.status(401).send('Not authorized');
}

function updateTocken(user){
  const expiration = +new Date() + 6000000;
  const payload = { id: user.id, username: user.username, expiration };
  const token = jwt.encode(payload, process.env.JWT_SECRET, ALGORITHM);
  if (user.token && user.token.token) {
    user.token.token = token;
  } else {
    user.token = { token };
    user.tokens.push(user.token);
  }
  return user.save();
}

function deleteToken(user, all) {
  if (all) {
    user.tokens.forEach( token => token.remove())
  } else {
    user.token.remove();
    return user.save();
  }
}
module.exports = {
  isAuthenticated,
  updateTocken,
  deleteToken
};