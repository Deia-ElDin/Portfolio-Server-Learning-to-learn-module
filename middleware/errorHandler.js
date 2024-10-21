const logEvents = require('./logEvents');

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}, ${err.statusCode}`, 'errLog.txt');

  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'ValidationError') {
    customError.statusCode = 400;
    const errMsg = Object.values(err.errors)
      .map((error) => error.message.replace('Must provide ', ''))
      .join(', ');
    customError.msg = `Must provide ${errMsg}`;
  }

  if (err.message === 'Unexpected end of form') {
    customError.statusCode = 400;
    customError.msg = "You can't submit an empty form!";
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;
