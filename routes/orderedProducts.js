const { default: axios } = require("axios");
const { response } = require("express");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const config = {
      headers: {
        Authorization: req.headers.authorization || "",
      },
    };

    const response = await axios.get(`${process.env.SHOPER_URL}/webapi/rest/order-products?limit=50`, config);
    const pages = response.data.pages;

    let bulkRequestBody = [];
    let batch = [];

    for (let i = 1; i <= pages; i++) {
      batch.push({
        id: `orders_page_${i}`,
        path: `/webapi/rest/order-products`,
        method: "GET",
        params: {
          limit: 50,
          page: i,
        },
      });

      if (i % 25 === 0 || i === pages) {
        bulkRequestBody.push(batch);
        batch = [];
      }
    }
    Promise.all(
      bulkRequestBody.map((batch) =>
        axios.post(`${process.env.SHOPER_URL}/webapi/rest/bulk`, JSON.stringify(batch), config)
      )
    ).then((data) => {
      res.send(
        data
          .map((el) => el.data.items.map((item) => item.body.list))
          .flat()
          .flat()
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Cos nie tak w zamowieniach" });
  }
});

module.exports = router;
