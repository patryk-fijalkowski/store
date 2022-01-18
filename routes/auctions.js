var express = require("express");
require("dotenv").config();
const axios = require("axios").default;
var db = require("../db");

var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const response = await axios.get(`${process.env.SHOPER_URL}/webapi/rest/auctions?limit=50&page=1`, {
      headers: {
        Authorization: `Bearer ${global.shoperAccessToken}`,
      },
    });

    const pages = response.data.pages;
    const bulkRequestBody = [];
    for (let i = 1; i <= pages; i++) {
      bulkRequestBody.push({
        id: `auctions-${i}`,
        path: "/webapi/rest/auctions",
        method: "GET",
        params: {
          limit: "50",
          page: i,
        },
      });
    }

    const bulkResponse = await axios.post(
      `${process.env.SHOPER_URL}/webapi/rest/bulk`,
      JSON.stringify(bulkRequestBody),
      {
        headers: {
          Authorization: `Bearer ${global.shoperAccessToken}`,
        },
      }
    );

    let allAuctions = bulkResponse.data.items
      .map((el) => el.body.list)
      .flat()
      .filter((el) => el.finished === "0")
      .map(({ real_auction_id, product_id }) => ({
        real_auction_id: real_auction_id,
        product_id: product_id,
      }));

    var batch = db.batch();

    allAuctions.forEach((doc) => {
      var docRef = db.collection("Auctions").doc(); //automatically generate unique id
      batch.set(docRef, doc);
    });
    batch.commit();

    res.send("Saved auctions in database");
  } catch (error) {
    res.status(error.response.status).send(error);
  }
});

module.exports = router;
