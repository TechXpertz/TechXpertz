const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { domain, oauth_client_id } = require('../config');


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

signUp = (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(403);
    };

    console.log(req.user.sub);
    next();
}

module.exports = {
    checkJwt,
    signUp
}