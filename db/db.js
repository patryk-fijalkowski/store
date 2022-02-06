const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  database: 'brillardb',
  password: 'P@tryk123!',
  port: 5432,
  host: 'localhost',
});

module.exports = client;
