'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const ObjectIdSchema = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const db = require('../db');
const schema = new Schema({
  _id: {
    type: ObjectIdSchema,
    default: () => {
      return new ObjectId();
    },
    set: value => {
      return ObjectId(value);
    }
  },
  username: {
    type: String,
    lowercase: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  }
});

schema.pre('save', function (next) {
  if (this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});


class User {


  constructor() {
    return db.model('User', schema);
  }


}

schema.loadClass(User);


module.exports = User;