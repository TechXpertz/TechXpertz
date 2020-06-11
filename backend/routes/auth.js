const router = require('express-promise-router')();
const { checkJwt, register } = require('../controllers/middleware');


router.route('/register').get(checkJwt, register);

router.route('/callback').get((req, res) => {
  res.send('callback called');
});

module.exports = router;
