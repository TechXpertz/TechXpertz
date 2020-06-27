require('dotenv').config({ path: 'backend/.env' });

const port = process.env.PORT || 5000;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;
const domain = process.env.DOMAIN;
const audience = process.env.AUDIENCE;
const auth0_client_id = process.env.AUTH0_CLIENT_ID;
const auth0_client_secret = process.env.AUTH0_CLIENT_SECRET;
const pusher_app_id = process.env.PUSHER_APP_ID;
const pusher_app_key = process.env.PUSHER_APP_KEY;
const pusher_app_secret = process.env.PUSHER_APP_SECRET;
const pusher_app_cluster = process.env.PUSHER_APP_CLUSTER;

module.exports = {
  port,
  db_user,
  db_password,
  db_host,
  db_port,
  db_name,
  auth_config: {
    domain,
    audience,
  },
  auth_client: {
    client_id: auth0_client_id,
    client_secret: auth0_client_secret
  },
  pusher_config: {
    appId: pusher_app_id,
    key: pusher_app_key,
    secret: pusher_app_secret,
    cluster: pusher_app_cluster
  }
};
