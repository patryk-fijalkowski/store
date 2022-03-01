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

    const data = await getBulkUtil('shippings', config);
    res.send(data);
  } catch (e) {
    res.status(500).send({ message: 'Cos nie tak w zamowieniach' });
  }
});

module.exports = router;
