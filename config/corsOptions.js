const whiteList = require('./whiteList');
const { UnauthorizedError } = require('../errors');

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin)) callback(null, true);
    else callback(new UnauthorizedError('Not allowed by CORS'));
  },
};

module.exports = corsOptions;
