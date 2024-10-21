const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must provide username'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Must provide password'],
    minLength: [6, 'Passwords must be more than 5 characters'],
    trim: true,
  },
  refreshToken: {
    type: String,
    default: '',
  },
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

UserSchema.methods.createAccessToken = function () {
  const payload = { userId: this._id, username: this.username };
  const jwtPw = process.env.ACCESS_TOKEN_SECRET;
  const jwtExpiresIn = { expiresIn: process.env.ACCESS_TOKEN_EXPIRE };

  const accessToken = jwt.sign(payload, jwtPw, jwtExpiresIn);
  return accessToken;
};

UserSchema.methods.createRefreshToken = function () {
  const payload = { userId: this._id, username: this.username };
  const jwtPw = process.env.REFRESH_TOKEN_SECRET;
  const jwtExpiresIn = { expiresIn: process.env.REFRESH_TOKEN_EXPIRE };

  const refreshToken = jwt.sign(payload, jwtPw, jwtExpiresIn);
  return refreshToken;
};

module.exports = mongoose.model('User', UserSchema);
