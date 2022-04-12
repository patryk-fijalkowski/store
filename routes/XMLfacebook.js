const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var builder = require("xmlbuilder2");

router.get("/", async (req, res) => {
  const response = await axios.get(
    `https://sklep992539.shoparena.pl/console/integration/execute/name/FacebookCatalogFeed`
  );

  var config = {
    method: "post",
    url: "http://localhost:3000/xml/facebook",
    headers: {
      "Content-Type": "application/xml",
    },
    data: response.data,
  };
  res.set("Content-Type", "text/xml");

  axios(config)
    .then(function (response) {
      if (response.data.hasOwnProperty("feed")) {
        console.log(response.data.feed.entry[0].additional_image_link);
        var feedObj = {
          feed: {
            "@xmlns": response.data.feed["$"].xmlns,
            "@xmlns:g": response.data.feed["$"]["xmlns:g"],
            title: { "#text": response.data.feed.title[0] },
            link: {
              "@rel": response.data.feed.link[0]["$"].rel,
              "@type": response.data.feed.link[0]["$"].type,
              "@href": response.data.feed.link[0]["$"].href,
            },
            updated: { "#text": response.data.feed.updated[0] },
            entry: response.data.feed.entry
              .filter((item) => !item.link[0].includes("medesthetic"))
              .map((item) => ({
                id: item.id[0],
                title: item.title[0],
                description: item.description[0],
                product_type: item.product_type[0],
                link: item.link[0],
                condition: item.condition[0],
                availability: item.availability[0],
                inventory: item.inventory[0],
                price: item.price[0],
                brand: item.brand[0],
                gtin: item.gtin ? item.gtin[0] : "",
                mpn: item.mpn[0],
                shipping_weight: item.shipping_weight[0],
                image_link: item.image_link[0],
                additional_image_link: item.additional_image_link
                  ? item.additional_image_link.map((additional_link) => ({
                      "#text": additional_link,
                    }))
                  : [],
              })),
          },
        };
        var feed = builder
          .create(feedObj, { encoding: "utf-8" })
          .end({ pretty: true });
        res.send(feed);
      } else {
        res.send();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/", async (req, res) => {
  res.send(req.body);
});

module.exports = router;
