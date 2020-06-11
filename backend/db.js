const Pool = require('pg').Pool;

const { db_user, db_password, db_host, db_port, db_name } = require('./config');

const pool = new Pool({
  user: db_user,
  password: db_password,
  host: db_host,
  port: db_port,
  database: db_name,
});

module.exports = pool;
