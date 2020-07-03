const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { createBooking } = require('../controllers/bookings/createBooking');
const { getUpcomingBookings } = require('../controllers/bookings/getBookings');
const { deleteBooking, deleteOtherTimeslots } = require('../controllers/bookings/deleteBooking');
const { createPastInterview } = require('../controllers/pastInterviews/createPastInterview');
const { getPastInterviews } = require('../controllers/pastInterviews/getPastInterviews');

router.route('/').post(checkJwt, createBooking);
router.route('/').delete(checkJwt, deleteBooking);
router.route('/upcoming').get(checkJwt, getUpcomingBookings);
router.route('/past').post(checkJwt, createPastInterview);
router.route('/past').get(checkJwt, getPastInterviews);
router.route('/other-timeslots').delete(checkJwt, deleteOtherTimeslots);

module.exports = router;