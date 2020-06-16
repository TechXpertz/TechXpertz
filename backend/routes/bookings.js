const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { createBooking } = require('../controllers/bookings/createBooking');

router.route('/').post(checkJwt, createBooking);

module.exports = router;