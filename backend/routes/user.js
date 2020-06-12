const router = require('express-promise-router')();
const { dashboard, submitAccountType, submitNormalBackground } = require('../controllers/users');
const { checkJwt } = require('../controllers/middleware');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/submit-account-type').post(checkJwt, submitAccountType);
router.route('/submit-normal-background').post(checkJwt, submitNormalBackground);

module.exports = router;
