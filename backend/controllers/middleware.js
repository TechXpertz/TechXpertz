const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { auth0_config } = require('../config');
const pool = require('../db');


// to validate token from front-end
checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0_config.domain}/.well-known/jwks.json`
    }),
    audience: auth0_config.audience,
    issuer: `https://${auth0_config.domain}/`,
    algorithms: ['RS256']
});

// 
register = async (req, res, next) => {
    console.log('register called');
    if (!req.user) {
        return res.sendStatus(403);
    };

    const sub = req.user.sub;
    const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [sub]);

    if (user.rows.length === 0) {
        await pool.query("INSERT INTO users (auth0_id) VALUES ($1)", [sub]);
    }

    console.log(req.user.sub);
    next();
}

module.exports = {
    checkJwt,
    register
}