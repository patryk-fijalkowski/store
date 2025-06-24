const { default: axios } = require('axios');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchWithRetry(url, config, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, config);
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(500); // poczekaj pół sekundy przed kolejną próbą
    }
  }
}

const getBulkUtil = async (bulkQuery, config) => {
  try {
    const firstResponse = await axios.get(
      `${process.env.SHOPER_URL}/webapi/rest/${bulkQuery}?limit=50`,
      config
    );

    const pages = firstResponse.data.pages;

    let allResults = [];
    // Dodaj wyniki z pierwszej strony
    if (firstResponse.data.list) {
      allResults = allResults.concat(firstResponse.data.list);
    }

    for (let i = 2; i <= pages; i++) {
      await sleep(200); // opóźnienie między żądaniami
      const res = await fetchWithRetry(
        `${process.env.SHOPER_URL}/webapi/rest/${bulkQuery}?limit=50&page=${i}`,
        config
      );
      if (res.data.list) {
        allResults = allResults.concat(res.data.list);
      }
    }

    return allResults;
  } catch (err) {
    console.log('error in getBulkUtil:', err);
    throw new Error(`Error in getBulkUtil: ${err.message}`);
  }
};

module.exports = getBulkUtil;
