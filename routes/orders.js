const { default: axios } = require('axios');
const { response } = require('express');
var express = require('express');
const getBulkUtil = require('../utils/getBulkUtil');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const config = {
      headers: {
        Authorization: req.headers.authorization || '',
      },
    };
    console.log(req.query.dateFrom);
    const { dateFrom, dateTo } = req.query;
    const filters = dateFrom && dateTo && JSON.stringify({ date: { '>=': dateFrom, '<=': dateTo } });
    console.log('asdasdd', filters);
    const data = await getBulkUtil('orders', config, filters);
    res.send(data);
  } catch (e) {
    res.status(500).send({ message: 'Cos nie tak w zamowieniach', error: e });
  }
});

module.exports = router;
