const router = require('express-promise-router')();
const { checkJwt, registerNormal } = require('../controllers/middleware');


router.route('/register').get(checkJwt, registerNormal, (req, res) => {
    res.send('success');
});

router.route('/callback').get((req, res) => {
    res.send('callback called');
});

module.exports = router;