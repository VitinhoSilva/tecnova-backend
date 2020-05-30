require('dotenv').config()
const { Pool } = require('pg');
const { postgres } = require('./.env');
const { sqlServer } = require('./.env');

/////////////////////POSTGRESQL CONNECTION////////////////

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${postgres.DB_USER}:${postgres.DB_PASSWORD}@${postgres.DB_HOST}:${postgres.DB_PORT}/${postgres.DB_DATABASE}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

/////////////////////SQL CONNECTION//////////////////////

const sqlConfig = {
  user: sqlServer.SQL_DB_USER,
  password: sqlServer.SQL_DB_PASSWORD ,
  server: sqlServer.SQL_DB_HOST,
  database: sqlServer.SQL_DB_DATABASE,
  port: parseInt(sqlServer.SQL_DB_PORT),
  options: {
      encrypt: true
  }
}

module.exports = { pool, sqlConfig }