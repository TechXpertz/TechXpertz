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

const create_or_find = async (user, is_expert) => {
    if (!req.user) {
        return res.sendStatus(403);
    };

    const sub = user.sub;
    const users = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [sub]);

    if (users.rows.length === 0) {
        await pool.query("INSERT INTO users (auth0_id, is_expert) VALUES ($1, $2)",
            [sub, is_expert]);
    }

    console.log(user.sub);
}

const register_normal = async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    }
    await create_or_find(req.user, false);
    next();
}

const register_expert = async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    }
    await create_or_find(req.user, true);
    next();
}

module.exports = {
    checkJwt,
    register_normal,
    register_expert
}