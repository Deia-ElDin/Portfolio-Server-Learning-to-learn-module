const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    throw new UnauthorizedError('Not authorized to access this route');

  const accessToken = authHeader.split(' ')[1];

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    throw new ForbiddenError("You don't have permission to access this source");
  }
};

module.exports = verifyToken;
