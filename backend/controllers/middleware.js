const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { domain } = require('../config');
const pool = require('../db');


// to validate token from front-end
checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`
    }),
    audience: 'http://localhost:5000/auth/signup',
    issuer: `https://${domain}/`,
    algorithms: ['RS256']
});

// 
signUp = async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    };

    const sub = req.user.sub;
    const user = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [sub]);

    if (user.rows.length !== 0) {
        return res.status(401).send("User already exists");
    }

    await pool.query("INSERT INTO users (auth0_id) VALUES ($1)", [sub]);

    console.log(req.user.sub);
    next();
}

module.exports = {
    checkJwt,
    signUp
}