require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    oauth_client_id: process.env.OAUTH_CLIENT_ID,
    oauth_client_secret: process.env.OAUTH_CLIENT_SECRET
};