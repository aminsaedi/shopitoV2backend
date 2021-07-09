const jwt = require("jsonwebtoken");
const config = require("config");

const errors = require("../utilities/errors");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ message: errors.enNoTokenProvided });
  try {
    const decode = jwt.verify(token, config.get("jwtKey"));
    req.user = decode;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ message: errors.enInvalidToken, error: error.toString() });
  }
};
