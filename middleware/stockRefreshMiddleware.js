const client = require('../db');
const getBulkUtil = require('../utils/getBulkUtil');

require('dotenv').config();

var stockRefreshMiddleware = async function (req, res, next) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${global.shoperAccessToken}` || '',
      },
    };

    const auctions = await getBulkUtil('auctions', config);
    const products = await getBulkUtil('products', config);

    const auctionsToInsert = auctions.map(
      (auction) =>
        `('${auction.product_id}', '${auction.real_auction_id}', '${auction.title}', '${auction.quantity}', '${auction.sold}', '${
          auction.start_time
        }', '${auction.end_time}', '${auction.is_draft === '1'}','${auction.finished === '1'}')`
    );
    const productsToInsert = products.map(
      (product) =>
        `('${product.product_id}', '${product.stock.stock_id}', '${product.stock.stock}', '${product.stock.price}', '${product.code}', '${
          product.translations.pl_PL.name
        }', '${
          product.children
            ? JSON.stringify(product.children.map((child) => ({ product_id: child.product_id, quantity: child.stock })))
            : null
        }')`
    );

    let query = `
           BEGIN TRANSACTION;
           
            DELETE FROM public."Auctions";
            DELETE FROM public."Products";
    
            INSERT INTO public."Auctions"(
              product_id, real_auction_id, title, quantity, sold, start_time, end_time, is_draft, finished)
              VALUES ${auctionsToInsert};
    
            INSERT INTO public."Products"(
              product_id, stock_id, stock_amount, price, code, name, children)
              VALUES ${productsToInsert};
    
          COMMIT;   
        `;

    client.query(query, (err, res) => {
      if (!err) {
        console.log(res.rows);
      } else {
        console.log(err.message);
      }
      client.end;
    });

    console.log('Stock successfully refreshed!');
    next();
  } catch (error) {
    res.status(error.response.status).send(error);
    return;
  }
};

module.exports = stockRefreshMiddleware;
