const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var builder = require("xmlbuilder2");

router.get("/", async (req, res) => {
  const response = await axios.get(
    `https://sklep992539.shoparena.pl/console/integration/execute/name/CeneoV2`
  );

  var config = {
    method: "post",
    url: "http://localhost:3000/xml/ceneo",
    headers: {
      "Content-Type": "application/xml",
    },
    data: response.data,
  };
  res.set("Content-Type", "text/xml");

  axios(config)
    .then(function (response) {
      if (response.data.hasOwnProperty("offers")) {
        console.log(
          response.data.offers.o.map((el) => el.imgs[0].main[0]["$"].url)
        );
        var feedObj = {
          offers: {
            "@version": response.data.offers["$"].version,
            "@xmlns:xsi": response.data.offers["$"]["xmlns:xsi"],
            o: response.data.offers.o.map((item) => ({
              "@weight": item["$"].weight,
              "@stock": item["$"].stock,
              "@set": item["$"].set,
              "@avail": item["$"].avail,
              "@price": item["$"].price,
              "@url": item["$"].url,
              "@id": item["$"].id,
              cat: { $: item.cat[0] },
              name: { $: item.name[0] },
              imgs: {
                main: {
                  "@url": item.imgs[0].main[0]["$"].url,
                },
              },
              desc: { $: item.desc ? item.desc[0] : "" },
              attrs: {
                a: item.attrs.map((attr) => {
                  return attr.a.map((el) => {
                    return {
                      "@name": el["$"] ? el["$"].name : "",
                      $: el ? el["_"] : "",
                    };
                  });
                }),
              },
            })),
          },
        };
        // console.log(feedObj);

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
