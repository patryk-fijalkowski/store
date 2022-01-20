var express = require("express");
var router = express.Router();
const axios = require("axios").default;
var qs = require("qs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const token = Buffer.from(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`, "utf8").toString(
    "base64"
  );

  const deviceResponse = await axios.post(
    `${process.env.ALLEGRO_URL}/auth/oauth/device`,
    qs.stringify({
      client_id: process.env.ALLEGRO_CLIENT_ID,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${token}`,
      },
    }
  );

  res.render("index", { title: "Link weryfikacyjny allegro", link: deviceResponse.data.verification_uri_complete });

  try {
    let idInterval = setInterval(async () => {
      let tokenResponse = await axios.post(
        `${process.env.ALLEGRO_URL}/auth/oauth/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code&device_code=${deviceResponse.data.device_code}`,
        {},
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );
      console.log("Response:", tokenResponse.data);

      if (tokenResponse.status === 200) {
        global.isAccessVerified = true;
        global.allegroAccessToken = tokenResponse.data.access_token;
        global.allegroRefreshToken = tokenResponse.data.refresh_token;
        clearInterval(idInterval);
      }
    }, 5000);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
