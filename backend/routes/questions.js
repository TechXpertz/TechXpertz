const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { getOrInsertQuestion } = require('../controllers/questions/questions');

router.route('/').post(checkJwt, getOrInsertQuestion);

module.exports = router;