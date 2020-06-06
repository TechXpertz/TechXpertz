const router = require('express-promise-router')();
const { dashboard } = require('../controllers/users');
const { isLoggedIn } = require('../controllers/auth');

router.route('/dashboard').get(isLoggedIn, dashboard);

module.exports = router;