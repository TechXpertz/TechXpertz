const router = require('express-promise-router')();
const { dashboard } = require('../controllers/users/dashboard');
const { submitAccountType } = require('../controllers/users/submitAccType');
const { submitNormalBackground, submitExpertBackground } = require('../controllers/users/submitBackground');
const { checkJwt } = require('../controllers/auth/register');
const { checkUserBackgroundSubmission } = require('../controllers/users/hasSubmittedForm');
const { getUserBackground } = require('../controllers/users/getBackgrounds');
const { accountType } = require('../controllers/users/accountType');
const { editNormalBackground, editExpertBackground } = require('../controllers/users/editBackground');
const { getUsername } = require('../controllers/users/username');

router.route('/dashboard').get(checkJwt, dashboard);
router.route('/account-type').post(checkJwt, submitAccountType);
router.route('/background').get(checkJwt, getUserBackground);
router.route('/normal-background').post(checkJwt, submitNormalBackground);
router.route('/expert-background').post(checkJwt, submitExpertBackground);
router.route('/has-submitted-background').get(checkJwt, checkUserBackgroundSubmission);
router.route('/account-type').get(checkJwt, accountType);
router.route('/normal-background').patch(checkJwt, editNormalBackground);
router.route('/expert-background').patch(checkJwt, editExpertBackground);
router.route('/username').get(checkJwt, getUsername);

module.exports = router;
