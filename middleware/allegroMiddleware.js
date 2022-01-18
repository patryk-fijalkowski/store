require("dotenv").config();
const axios = require("axios").default;

var authMiddleware = async function (req, res, next) {
  next();
};

module.exports = authMiddleware;
