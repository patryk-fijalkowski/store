const {
  updateOrdersTable,
  updateAuctionsTable,
  updateProductsTable,
  updateOrderProductsTable,
  updateShippingsTable,
} = require('./utils/updateTablesUtil');

require('dotenv').config();

var updateDB = async function (req, res, next) {
  try {
    await updateOrdersTable();
    await updateAuctionsTable();
    await updateProductsTable();
    await updateOrderProductsTable();
    await updateShippingsTable();
    console.log('zaktualizowano auckje');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    return;
  }
};

module.exports = updateDB;
