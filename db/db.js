const { Client } = require('pg');

const client = new Client({
  user: 'brillar@brillardb',
  database: 'postgres',
  password: 'Kreator230120',
  port: 5432,
  host: 'brillardb.postgres.database.azure.com',
});

module.exports = client;
