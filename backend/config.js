require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    auth0_config: {
        domain: "techxpertz.auth0.com",
        audience: "techxpertz/api"
    }
};