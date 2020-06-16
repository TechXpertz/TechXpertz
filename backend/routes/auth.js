const router = require('express-promise-router')();
const { checkJwt, register } = require('../controllers/auth/register');


router.route('/register').post(checkJwt, register);

router.route('/callback').get((req, res) => {
  res.send('callback called');
});

module.exports = router;
