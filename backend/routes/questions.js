const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { getQuestion } = require('../controllers/questions/questions');

router.route('/').get(checkJwt, getQuestion);

module.exports = router;