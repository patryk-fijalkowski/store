require("dotenv").config();
const axios = require("axios").default;

var authMiddleware = async function (req, res, next) {
  const token = Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, "utf8").toString("base64");
  try {
    const response = await axios.post(
      `${process.env.SHOPER_URL}/webapi/rest/auth`,
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    global.shoperAccessToken = response.data.access_token;
    next();
  } catch (error) {
    console.error(error.response.status);
    res.status(error.response.status).send(error);
  }
};

module.exports = authMiddleware;
