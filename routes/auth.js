const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();

router.post("/", async function (req, res, next) {
  const token = Buffer.from(`${req.body.login}:${req.body.password}`, "utf8").toString("base64");

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
    res.send({ accessToken: response.data.access_token });
  } catch (e) {
    res.status(e.response.status).send({ message: "Niepoprawny login lub hasło" });
  }
});

module.exports = router;
