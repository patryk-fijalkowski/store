var express = require("express");
var router = express.Router();
const axios = require("axios").default;
var qs = require("qs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const token = Buffer.from(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`, "utf8").toString(
    "base64"
  );
  console.log(token, process.env.ALLEGRO_CLIENT_ID, process.env.ALLEGRO_CLIENT_SECRET);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${token}`,
  };

  const data = qs.stringify({
    client_id: process.env.ALLEGRO_CLIENT_ID,
  });

  try {
    const response = await axios.post(`https://allegro.pl/auth/oauth/device`, data, {
      headers: headers,
    });

    res.render("index", { title: "Link weryfikacyjny allegro", link: response.data.verification_uri_complete });
    // res.send(response.data);
  } catch (e) {
    res.send(e);
  }

  // res.render("index", { title: "Express" });
});

module.exports = router;
