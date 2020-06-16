const router = require('express-promise-router')();
const { dashboard } = require('../controllers/users/dashboard');
const { submitAccountType } = require('../controllers/users/submitAccType');
const { submitNormalBackground } = require('../controllers/users/submitNormalBackground');
const { checkJwt } = require('../controllers/auth/register');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/account-type').post(checkJwt, submitAccountType);
router.route('/normal-background').post(checkJwt, submitNormalBackground);

module.exports = router;
