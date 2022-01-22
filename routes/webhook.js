const { default: axios } = require("axios");
var express = require("express");
const moment = require("moment");
var User = require("../db");
var router = express.Router();
var db = require("../db");

/* GET users listing. */
router.post("/", async function (req, res, next) {
  try {
    let bulkRequestBody = req.body.products.map((el) => ({
      id: `product_id_${el.product_id}`,
      path: `/webapi/rest/products/${el.product_id}`,
      method: "GET",
    }));

    const response = await axios.post(`${process.env.SHOPER_URL}/webapi/rest/bulk`, JSON.stringify(bulkRequestBody), {
      headers: {
        Authorization: `Bearer ${global.shoperAccessToken}`,
      },
    });

    const productsStock = response.data.items.map((el) => ({
      product_id: el.body.product_id,
      stock: el.body.stock.stock,
    }));

    const products = req.body.products.map((product) => ({
      status: "inModification",
      name: product.name,
      product_id: product.product_id,
      real_auction_id: "asadas",
      stock_amount_previous: productsStock.filter((el) => el.product_id === product.product_id).pop().stock * 1,
      stock_amount_current:
        1 * productsStock.filter((el) => el.product_id === product.product_id).pop().stock - product.quantity,
    }));

    const data = {
      order_id: req.body.order_id,
      paid: req.body.paid,
      order_date: req.body.date,
      modification_date: moment().format("YYYY-MM-DDD H:mm:ss"),
      source: req.body.payment.name === "Allegro" ? "Allegro" : "Sklep",
      products: products,
    };

    db.collection("Orders").doc().set(data);
    console.log("saved");
    res.send(" saved");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
});

module.exports = router;
