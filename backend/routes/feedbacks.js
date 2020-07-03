const { checkJwt } = require('../controllers/auth/register');
const { createFeedback } = require('../controllers/feedbacks/createFeedback');
const router = require('express-promise-router')();

router.route('/').post(checkJwt, createFeedback);

module.exports = router;