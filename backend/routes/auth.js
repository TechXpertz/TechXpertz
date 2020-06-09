const router = require('express-promise-router')();
const { checkJwt, signUp } = require('../controllers/middleware');

router.route('/signup').get(checkJwt, signUp, (req, res) => {
    res.send('signup success!');
})

router.route('/login').get(checkJwt, (req, res) => {
    res.send('login success!');
});

router.route('/callback').get((req, res) => {
    res.send('callback called');
});

module.exports = router;