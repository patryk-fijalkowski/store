var express = require("express");
var User = require("../db");
var router = express.Router();
var db = require("../db");

/* GET users listing. */
router.post("/", function (req, res, next) {
  try {
    const data = {
      date: req.body.date,
      sum: req.body.sum,
      source: req.body.payment.name === "Allegro" ? "Allegro" : "Sklep",
      products: req.body.products ? JSON.stringify(req.body.products) : null,
      body: JSON.stringify(req.body),
    };
    db.collection("Orders").doc().set(data);
    console.log("saved");

    res.send("Shoper webhoook");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
});

module.exports = router;
