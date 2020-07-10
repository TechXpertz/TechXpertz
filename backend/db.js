const Pool = require('pg').Pool;
const url = require('url');

const { db_user, db_password, db_host, db_port, db_name } = require('./config');

let config;

if (process.env.DATABASE_URL) {
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };
  console.log(config);
} else {
  config = {
    user: db_user,
    password: db_password,
    host: db_host,
    port: db_port,
    database: db_name,
  }
}

const pool = new Pool(config);

module.exports = pool;
