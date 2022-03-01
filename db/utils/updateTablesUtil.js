const moment = require('moment');
const getBulkUtil = require('../../utils/getBulkUtil');
const client = require('../db');

var updateOrdersTable = async function () {
  const orders = await getBulkUtil('orders', global.shoperAuthConfig);

  const ordersToInsert = orders.map(
    (order) =>
      `('${order.order_id}', '${order.date}', '${moment().format('YYYY-MM-DDD H:mm:ss')}', '${order.paid}', '${
        order.auction ? 'Allegro' : 'Sklep'
      }', '${order.is_paid}', '${order.shipping_cost}', '${order.shipping_id}')`,
  );

  let query = `
  BEGIN TRANSACTION;
  
   DELETE FROM public."Orders";

   INSERT INTO public."Orders"(
     order_id, order_date, modification_date, paid, source, status, shipping_cost, shipping_id)
     VALUES ${ordersToInsert};

   COMMIT;   
`;

  return client.query(query);
};

var updateAuctionsTable = async function () {
  const auctions = await getBulkUtil('auctions', global.shoperAuthConfig);

  const auctionsToInsert = auctions.map(
    (auction) =>
      `('${auction.product_id}', '${auction.real_auction_id}', '${auction.title}', '${auction.quantity}', '${auction.sold}', '${
        auction.start_time
      }', '${auction.end_time}', '${auction.is_draft === '1'}','${auction.finished === '1'}')`,
  );
  let query = `
  BEGIN TRANSACTION;
  
   DELETE FROM public."Auctions";

   INSERT INTO public."Auctions"(
    product_id, real_auction_id, title, quantity, sold, start_time, end_time, is_draft, finished)
    VALUES ${auctionsToInsert};

   COMMIT;   
`;
  return client.query(query);
};

var updateProductsTable = async function () {
  const products = await getBulkUtil('products', global.shoperAuthConfig);

  const productsToInsert = products.map(
    (product) =>
      `('${product.product_id}', '${product.stock.stock_id}', '${product.stock.stock}', '${product.stock.price}', '${product.code}', '${
        product.translations.pl_PL.name
      }', '${
        product.children ? JSON.stringify(product.children.map((child) => ({ product_id: child.product_id, quantity: child.stock }))) : null
      }')`,
  );

  let query = `
  BEGIN TRANSACTION;
  
   DELETE FROM public."Products";

   INSERT INTO public."Products"(
    product_id, stock_id, stock_amount, price, code, name, children)
    VALUES ${productsToInsert};

   COMMIT;   
`;
  return client.query(query);
};

var updateOrderProductsTable = async function () {
  const orderProducts = await getBulkUtil('order-products', global.shoperAuthConfig);

  const orderProductsToInsert = orderProducts.map(
    (product) =>
      `('${product.id}', '${product.product_id}', '${product.order_id}', '${product.price}', '${product.stock_id}','${
        product.children
          ? JSON.stringify(product.children.map((child) => ({ product_id: child.product_id, quantity: child.quantity })))
          : null
      }')`,
  );

  let query = `
  BEGIN TRANSACTION;
  
   DELETE FROM public."Order-products";

   INSERT INTO public."Order-products"(
    id, product_id, order_id, price, stock_id, children)
    VALUES ${orderProductsToInsert};

   COMMIT;   
`;
  return client.query(query);
};

var updateShippingsTable = async function () {
  const shippings = await getBulkUtil('shippings', global.shoperAuthConfig);

  const shippingsToInsert = shippings.map((shipping) => `('${shipping.shipping_id}', '${shipping.name}', '${shipping.cost}')`);

  let query = `
  BEGIN TRANSACTION;
  
  DELETE FROM public."Shippings";

   INSERT INTO public."Shippings"(
    shipping_id, name, cost)
     VALUES ${shippingsToInsert};

   COMMIT;   
`;
  return client.query(query);
};

module.exports = {
  updateOrdersTable: updateOrdersTable,
  updateAuctionsTable: updateAuctionsTable,
  updateProductsTable: updateProductsTable,
  updateOrderProductsTable: updateOrderProductsTable,
  updateShippingsTable: updateShippingsTable,
};
