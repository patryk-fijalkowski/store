const { default: axios } = require('axios');
const filter = require('jade/lib/filters');

const getBulkUtil = async (bulkQuery, config, filters = '') => {
  const response = await axios.get(`${process.env.SHOPER_URL}/webapi/rest/${bulkQuery}?limit=50&filters=${filters}`, config);

  const pages = response.data.pages;

  let bulkRequestBody = [];
  let batch = [];

  for (let i = 1; i <= pages; i++) {
    batch.push({
      id: `orders_page_${i}`,
      path: `/webapi/rest/${bulkQuery}`,
      method: 'GET',
      params: {
        filters: filters,
        limit: 50,
        page: i,
      },
    });

    if (i % 25 === 0 || i === pages) {
      bulkRequestBody.push(batch);
      batch = [];
    }
  }
  return Promise.all(
    bulkRequestBody.map((batch) => axios.post(`${process.env.SHOPER_URL}/webapi/rest/bulk`, JSON.stringify(batch), config)),
  ).then((data) =>
    data
      .map((el) => el.data.items.map((item) => item.body.list))
      .flat()
      .flat(),
  );
};

module.exports = getBulkUtil;
