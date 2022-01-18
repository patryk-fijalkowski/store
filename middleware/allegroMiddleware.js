require("dotenv").config();
const axios = require("axios").default;

var allegroMiddleware = async function (req, res, next) {
  if (global.isAccessVerified) {
    const token = Buffer.from(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`, "utf8").toString(
      "base64"
    );
    const response = await axios.post(
      `${process.env.ALLEGRO_URL}/auth/oauth/token?grant_type=refresh_token&refresh_token=${global.allegroRefreshToken}`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${token}`,
        },
      }
    );
    global.allegroAccessToken = response.data.access_token;
    global.allegroRefreshToken = response.data.refresh_token;
    console.log(response.data);
    next();
  } else {
    res.send("Please verify your device");
  }
};

module.exports = allegroMiddleware;
