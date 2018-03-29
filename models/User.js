const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  }
})

const User = module.exports = mongoose.model('users', UserSchema)