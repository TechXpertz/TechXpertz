const router = require('express-promise-router')();
const { dashboard, submitAccountType, submitNormalBackground } = require('../controllers/users');
const { checkJwt } = require('../controllers/middleware');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/account-type').post(checkJwt, submitAccountType);
router.route('/normal-background').post(checkJwt, submitNormalBackground);

module.exports = router;
