const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require('../errors');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    if (!username && !password)
      throw new BadRequestError('Must provide username and password');
    else if (!username) throw new BadRequestError('Must provide username');
    else if (!password) throw new BadRequestError('Must provide password');
  }

  const loggedUser = await User.findOne({ username }).exec();
  if (!loggedUser) throw new UnauthorizedError('Invalid Credentials');

  const isPasswordCorrect = await loggedUser.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthorizedError('Invalid Credentials');

  const accessToken = loggedUser.createAccessToken();
  const refreshToken = loggedUser.createRefreshToken();

  loggedUser.refreshToken = refreshToken;
  await loggedUser.save();

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
  };

  res.cookie('jwt', refreshToken, cookieOptions);
  res.status(200).json({ accessToken });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) throw new UnauthorizedError('Invalid Credentials');

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser)
    throw new ForbiddenError("You don't have permission to access this source");

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = foundUser.createAccessToken();
    res.status(200).json({ accessToken });
  } catch (err) {
    throw new ForbiddenError("You don't have permission to access this source");
  }
};

const logout = async (req, res) => {
  if (!req?.cookies?.jwt) return res.sendStatus(204);

  const cookies = req.cookies;

  const refreshToken = cookies.jwt;

  const loggedOutUser = await User.findOne({ refreshToken }).exec();

  if (!loggedOutUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(403);
  }

  loggedOutUser.refreshToken = '';
  await loggedOutUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

module.exports = {
  login,
  refresh,
  logout,
};
