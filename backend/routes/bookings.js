const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/middleware');
const { createBooking } = require('../controllers/bookings');

router.route('/').post(checkJwt, createBooking);

module.exports = router;