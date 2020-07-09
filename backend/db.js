const Pool = require('pg').Pool;

const { db_user, db_password, db_host, db_port, db_name } = require('./config');

let pool;
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
} else {
  pool = new Pool({
    user: db_user,
    password: db_password,
    host: db_host,
    port: db_port,
    database: db_name,
  });
}

pool.on('error', (err, client) => {
  console.error('Unexpected error on postgres client', err);
  process.exit(-1);
})

module.exports = pool;
