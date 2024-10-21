const whiteList = require("../config/whiteList");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  console.log("origin: ", origin);

  if (whiteList.includes(origin)) console.log("allowed white list");
  else console.log("not allowed");

  if (whiteList.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }

  next();
};

module.exports = credentials;
