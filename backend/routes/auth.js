const router = require('express-promise-router')();
const { checkJwt, register_normal } = require('../controllers/middleware');


router.route('/register').get(checkJwt, register_normal, (req, res) => {
    res.send('success');
})

router.route('/login').get(checkJwt, (req, res) => {
    res.send('login success!');
});

router.route('/callback').get((req, res) => {
    res.send('callback called');
});

module.exports = router;