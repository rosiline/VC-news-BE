const knex = require('knex');

const env = process.env.NODE_ENV || 'development';
const config = env === 'production'
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : require('../knexfile');

const connection = knex(config);

module.exports = connection;
