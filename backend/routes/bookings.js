const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { createBooking } = require('../controllers/bookings/createBooking');
const { getUpcomingBookings } = require('../controllers/bookings/getBookings');
const { deleteBooking } = require('../controllers/bookings/deleteBooking');

router.route('/').post(checkJwt, createBooking);
router.route('/').delete(checkJwt, deleteBooking);
router.route('/upcoming').get(checkJwt, getUpcomingBookings);

module.exports = router;