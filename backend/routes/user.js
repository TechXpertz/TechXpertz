const router = require('express-promise-router')();
const { dashboard } = require('../controllers/users/dashboard');
const { submitAccountType } = require('../controllers/users/submitAccType');
const { submitNormalBackground, submitExpertBackground } = require('../controllers/users/submitBackground');
const { checkJwt } = require('../controllers/auth/register');
const { checkUserBackgroundSubmission } = require('../controllers/users/hasSubmittedForm');
const { getUserBackground } = require('../controllers/users/getBackgrounds');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/account-type').post(checkJwt, submitAccountType);
router.route('/background').get(checkJwt, getUserBackground);
router.route('/normal-background').post(checkJwt, submitNormalBackground);
router.route('/expert-background').post(checkJwt, submitExpertBackground);
router.route('/has-submitted-background').get(checkJwt, checkUserBackgroundSubmission);

module.exports = router;
