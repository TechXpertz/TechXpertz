const router = require('express-promise-router')();
const { dashboard, submitAccountType } = require('../controllers/users');
const { checkJwt } = require('../controllers/middleware');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/submit-account-type').post(checkJwt, submitAccountType);

module.exports = router;
