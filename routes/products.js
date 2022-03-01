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
    const data = await getBulkUtil('products', config);
    res.send(data);
  } catch (e) {
    res.status(500).send({ message: 'Cos nie tak w zamowieniach' });
  }
});

router.put('/:id', async function (req, res, next) {
  console.log(req.body, req.params.id);
  try {
    const config = {
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
    };

    const data = {
      translations: {
        pl_PL: {
          description: req.body.description,
        },
      },
    };

    res.send(data);
    const response = await axios.put(`${process.env.SHOPER_URL}/webapi/rest/products/${req.params.id}`, JSON.stringify(data), config);
    res.send(response.data);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

module.exports = router;
