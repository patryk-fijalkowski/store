const { default: axios } = require('axios');
var express = require('express');
const moment = require('moment');
var router = express.Router();
const client = require('../db');
/* GET users listing. */

router.post('/', async function (req, res, next) {
  req.setTimeout(500000);

  const event = req.headers['x-webhook-name'];

  switch (event) {
    case 'order.paid':
      const order_id = req.body.order_id;
      const order_date = req.body.date;
      const paid = req.body.paid;
      const shipping = req.body.shipping;
      const modification_date = moment().format('YYYY-MM-DDD H:mm:ss');
      const source = req.body.payment.name === 'Allegro' ? 'Allegro' : 'Sklep';
      const status = event;
      const products = req.body.products.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        children: product.children.map((child) => ({ product_id: child.product_id, quantity: child.quantity })),
      }));

      // let query = `INSERT INTO public."Orders"(
      //   order_id, order_date, modification_date, paid, source, status, products, shipping_cost, shipping_name)
      //   VALUES('${order_id}', '${order_date}', '${modification_date}', '${paid}','${source}', '${status}', '${JSON.stringify(products)}',
      //   '${shipping.cost}', '${shipping.name}')`;

      // client.query(query, (err, res) => {
      //   if (!err) {
      //     console.log(res.rows);
      //   } else {
      //     console.log(err.message);
      //   }
      //   client.end;
      // });

      // SELECT * FROM public."Products" WHERE product_id IN ('2195', '11', '222', '1212')
      const orderedProductsIDs = products
        .map((product) => [product.product_id, ...product.children.map((child) => child.product_id)])
        .flat();
      console.log(orderedProductsIDs);

      if (true) {
      }

      break;
    case 'order.delete':
      console.log(event);
      break;
    case 'product.edit':
      console.log(event);
      break;
    default:
      console.log(`Unknown event.`);
  }

  // try {
  //   let bulkRequestBody = req.body.products.map((el) => ({
  //     id: `product_id_${el.product_id}`,
  //     path: `/webapi/rest/products/${el.product_id}`,
  //     method: "GET",
  //   }));

  //   const response = await axios.post(`${process.env.SHOPER_URL}/webapi/rest/bulk`, JSON.stringify(bulkRequestBody), {
  //     headers: {
  //       Authorization: `Bearer ${global.shoperAccessToken}`,
  //     },
  //   });

  //   const productsStock = response.data.items.map((el) => ({
  //     product_id: el.body.product_id,
  //     stock: el.body.stock.stock,
  //   }));

  //   const products = req.body.products.map((product) => ({
  //     status: "inModification",
  //     name: product.name,
  //     product_id: product.product_id,
  //     real_auction_id: "asadas",
  //     stock_amount_previous: productsStock.filter((el) => el.product_id === product.product_id).pop().stock * 1,
  //     stock_amount_current:
  //       1 * productsStock.filter((el) => el.product_id === product.product_id).pop().stock - product.quantity,
  //   }));

  //   const data = {
  //     order_id: req.body.order_id,
  //     paid: req.body.paid,
  //     order_date: req.body.date,
  //     modification_date: moment().format("YYYY-MM-DDD H:mm:ss"),
  //     source: req.body.payment.name === "Allegro" ? "Allegro" : "Sklep",
  //     products: products,
  //   };

  //   db.collection("Orders").doc().set(data);
  //   console.log("saved");
  //   res.send(" saved");
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).send({ error: e });
  // }
});

module.exports = router;
