const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.post("/", async function (req, res, next) {
  console.log(req.body);

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
    console.log(e.response.status);
    res.status(e.response.status).send({ message: "Niepoprawny login lub hasło" });
  }
});

module.exports = router;
