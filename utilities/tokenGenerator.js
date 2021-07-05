const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (values) => {
  const token = jwt.sign(values, config.get("jwtKey"), {
    expiresIn: config.get("jwtExpireTime"),
  });
  return token;
};
