const router = require('express-promise-router')();
const pool = require('../db');
const passport = require('passport');
require('../passport-setup');

const UsersController = require('../controllers/auth');
const { signUp, logIn, failed, logOut } = UsersController;

// router.route('/signup').post(signUp);

// router.route('/login').post(logIn);

router.route('/failed').get(failed);

router.route('/logout').get(logOut);

router.route('/google')
    .get(passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

router.route('/google/callback')
    .get(passport.authenticate('google', { failureRedirect: '/failed' }),
        function (req, res) {
            res.redirect('/user/dashboard');
        });


module.exports = router;