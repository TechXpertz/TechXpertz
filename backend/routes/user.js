const router = require('express-promise-router')();
const { dashboard } = require('../controllers/users');
const { checkJwt } = require('../controllers/middleware');

router.route('/dashboard').get(checkJwt, dashboard);

module.exports = router;
