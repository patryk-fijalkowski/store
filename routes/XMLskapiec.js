const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();
var builder = require("xmlbuilder2");

router.get("/", async (req, res) => {
  const response = await axios.get(
    `https://sklep992539.shoparena.pl/console/integration/execute/name/Skapiec`
  );

  var config = {
    method: "post",
    url: "http://localhost:3000/xml/skapiec",
    headers: {
      "Content-Type": "application/xml",
    },
    data: response.data,
  };
  res.set("Content-Type", "text/xml");

  axios(config)
    .then(function (response) {
      if (response.data.hasOwnProperty("xmldata")) {
        var feedObj = {
          xmldata: {
            version: { "#text": response.data.xmldata.version[0] },
            time: { "#text": response.data.xmldata.time[0] },
            data: {
              item: response.data.xmldata.data[0].item
                .filter((item) => !item.url[0].includes("medesthetic"))
                .map((item) => ({
                  compid: item.compid[0],
                  catpath: item.catpath[0],
                  catname: item.catname[0],
                  name: item.name[0],
                  vendor: item.vendor[0],
                  partnr: item.partnr[0],
                  price: item.price[0],
                  photo: item.photo[0],
                  desclong: { $: item.desclong[0] },
                  availability: item.availability[0],
                  EAN: item.ean ? item.ean[0] : "",
                  url: item.url[0],
                })),
            },
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
