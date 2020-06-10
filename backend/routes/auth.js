const router = require('express-promise-router')();
const { checkJwt, register } = require('../controllers/middleware');


router.route('/register').get(checkJwt, register, (req, res) => {
    res.send('success');
})

router.route('/login').get(checkJwt, (req, res) => {
    res.send('login success!');
});

router.route('/callback').get((req, res) => {
    res.send('callback called');
});

module.exports = router;