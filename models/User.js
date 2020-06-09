const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'online',
  },
  rank: {
    type: String,
    default: 'user',
  },
});

module.exports = mongoose.model('User', UserSchema);
