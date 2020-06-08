const router = require('express-promise-router')();
const { checkJwt, signUp } = require('../controllers/middleware');

router.route('/signup').get(checkJwt, signUp, (req, res) => {
    res.send('success');
})

router.route('/callback').get((req, res) => {
    res.send('callback called');
});

module.exports = router;