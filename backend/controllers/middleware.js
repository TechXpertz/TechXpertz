const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const pool = require('../db');
const { auth_config } = require('../config');

// validate token from front-end
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth_config.domain}/.well-known/jwks.json`
    }),
    audience: auth_config.audience,
    issuer: `https://${auth_config.domain}/`,
    algorithms: ['RS256']
});

const createOrFindUser = async (user, is_expert) => {

    const sub = user.sub;
    const users = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [sub]);

    if (users.rows.length === 0) {
        await pool.query("INSERT INTO users (auth0_id, is_expert) VALUES ($1, $2)",
            [sub, is_expert]);
    }

    console.log(user.sub);
}

const registerNormal = async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    }
    await createOrFindUser(req.user, false);
    next();
}

const registerExpert = async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    }
    await createOrFindUser(req.user, true);
    next();
}

module.exports = {
    checkJwt,
    registerNormal,
    registerExpert
}