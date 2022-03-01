const { default: axios } = require('axios');
var express = require('express');
const moment = require('moment');
var router = express.Router();
const client = require('../db/db');
const updateDB = require('../db/updateDB');
const { updateAuctionsTable } = require('../db/utils/updateTablesUtil');

const insertOrderIntoDB = (order, event) => {
  const query = `INSERT INTO public."Orders"(
    order_id, order_date, modification_date, paid, source, status, shipping_cost, shipping_id)
    VALUES('${order.order_id}', '${order.date}', '${moment().format('YYYY-MM-DDD H:mm:ss')}', '${order.paid}','${
    order.payment.name === 'Allegro' ? 'Allegro' : 'Sklep'
  }', '${event}',
    '${order.shipping.cost}', '${order.shipping.shipping_id}');`;

  return client.query(query);
};

const insertOrderProductsIntoDB = (order) => {
  const orderProductsToInsert = order.products.map(
    (product) =>
      `('${product.id}', '${product.product_id}', '${product.order_id}', '${product.price}', '${product.stock_id}','${
        product.children
          ? JSON.stringify(product.children.map((child) => ({ product_id: child.product_id, quantity: child.quantity })))
          : null
      }')`,
  );

  const query = `INSERT INTO public."Order-products"(
    id, product_id, order_id, price, stock_id, children)
    VALUES ${orderProductsToInsert};`;

  return client.query(query);
};

const insertHistoryRecord = (data, event) => {
  const query = `INSERT INTO public."History"(
    date, order_id, event, data)
    VALUES ('${moment().format('YYYY-MM-DDD H:mm:ss')}', '${data.order_id}', '${event}', '${JSON.stringify(data)}');`;

  return client.query(query);
};

router.post('/', async function (req, res, next) {
  req.setTimeout(500000);

  const event = req.headers['x-webhook-name'];

  switch (event) {
    case 'order.paid':
      if (req.body.payment.name !== 'Allegro') {
        // await updateAuctionsTable();
        console.log('Auctions updated');

        for (let i = 0; i < req.body.products.length; i++) {
          const product_id = req.body.products[i].product_id;
          const quantity = req.body.products[i].quantity;
          const query = `SELECT product_id, real_auction_id
          FROM public."Auctions" WHERE finished = 'false' AND product_id = '${product_id}';`;
          const response = await client.query(query);

          console.log(response.rows);
          if (!response.rows.length) {
            return res.sendStatus(404);
          }

          const realAuctionId = response.rows[0].real_auction_id;

          const allegroResponse = await axios.get(
            `${process.env.API_ALLEGRO_URL}/sale/product-offers/${realAuctionId}`,
            global.allegroAuthConfig,
          );

          if (allegroResponse.data.publication.status === 'ENDED') {
            return res.send(404);
          }

          const shoperResponse = await axios.get(`${process.env.SHOPER_URL}/webapi/rest/products/${product_id}`, global.shoperAuthConfig);

          console.log(
            product_id,
            quantity,
            realAuctionId,
            allegroResponse.data.stock.available,
            allegroResponse.data.stock.available - quantity,
            allegroResponse.data.publication.status,
            shoperResponse.data.stock.stock,
          );
          console.log(allegroResponse);
          // await axios.patch(
          //   `${process.env.API_ALLEGRO_URL}/sale/product-offers/${realAuctionId}`,
          //   {
          //     stock: {
          //       available: shoperResponse.data.stock.stock,
          //     },
          //   },
          //   global.allegroAuthConfig,
          // );
          await client.query(`INSERT INTO public."History"(
            date, order_id, event, data)
            VALUES ('${moment().format('YYYY-MM-DDD H:mm:ss')}', '${req.body.order_id}', '${event}', '${JSON.stringify(req.body)}');`);
          return res.sendStatus(200);
        }
      }
      // await insertOrderIntoDB(req.body, event);
      // console.log('Dodano zamówienie do bazy');

      // await insertOrderProductsIntoDB(req.body);
      // console.log('Dodano zamówione produkty');

      // await insertHistoryRecord(req.body, event);
      // console.log('Dodano zapytanie do historii');

      res.send();
      break;
    case 'order.delete':
      console.log(event);
      break;
    case 'product.edit':
      console.log(event);
      break;
    case 'product.create':
      console.log(event);
      break;
    default:
      console.log(`Unknown event.`);
  }

  // const checkIfDBShouldBeUpdate = async (order) => {
  //   const products = order.products.map((product) => ({
  //     product_id: product.product_id,
  //     quantity: product.quantity,
  //     children: product.children && product.children.map((child) => ({ product_id: child.product_id, quantity: child.quantity })),
  //   }));

  //   const orderedProductsIDs = products
  //     .map((product) =>
  //       product.children
  //         ? [`'${product.product_id}'`, ...product.children.map((child) => `'${child.product_id}'`)]
  //         : [`'${product.product_id}'`],
  //     )
  //     .flat();

  //   const dbShipping = await client.query(`SELECT * FROM public."Shippings" WHERE shipping_id = '${order.shipping_id}'`);
  //   const dbProducts = await client.query(`SELECT * FROM public."Products" WHERE product_id IN (${orderedProductsIDs.toString()})`);
  //   const dbAuctions = await client.query(`SELECT * FROM public."Auctions" WHERE product_id IN (${orderedProductsIDs.toString()})`);

  //   if (!dbShipping.rows.length) {
  //     await updateProductsTable();
  //     console.log('zaktualizowano formy dostawy');
  //   }
  //   if (dbProducts.rows.length !== orderedProductsIDs.length) {
  //     await updateProductsTable();
  //     console.log('zaktualizowano produkty');
  //   }
  //   if (dbAuctions.rows.length !== orderedProductsIDs.length) {
  //     await updateAuctionsTable();
  //     console.log('zaktualizowano aukcje');
  //   }
  // };

  // if (req.body.payment.name !== 'Allegro') {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${global.allegroAccessToken}` || '',
  //         Accept: 'application/vnd.allegro.beta.v2+json',
  //         ['Content-Type']: 'application/vnd.allegro.beta.v2+json',
  //       },
  //     };

  //     for (let i = 0; i < response.rows.length; i++) {
  //       const query = `INSERT INTO public."History"(
  //         date, product_id, related_order, parent_id, prev_stock_amount, currenct_stock_amount, is_stock_updated, event)
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

  //       let test = await axios.get(`${process.env.API_ALLEGRO_URL}/sale/product-offers/${response.rows[i].real_auction_id}`, config);

  //       await axios.patch(
  //         `${process.env.API_ALLEGRO_URL}/sale/product-offers/${response.rows[i].real_auction_id}`,
  //         {
  //           stock: {
  //             available: response.rows[i].stock_amount,
  //           },
  //         },
  //         config,
  //       );
  //     }

  //     console.log('Pomyślnie zaktualizowano');
  //     // res.send(response.rows);
  //   } catch (e) {
  //     console.log(e);
  //     res.send(e);
  //   }
  // }

  // const response = await client.query(
  //   `SELECT a.real_auction_id, a.quantity, a.sold, p.product_id, p.stock_amount FROM public."Auctions" a, public."Products" p WHERE a.product_id IN (${orderedProducts}) AND a.finished = false AND a.product_id = p.product_id`,
  // );

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
