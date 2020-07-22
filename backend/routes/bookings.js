const router = require('express-promise-router')();
const { checkJwt } = require('../controllers/auth/register');
const { createBooking } = require('../controllers/bookings/createBooking');
const { getUpcomingBookings } = require('../controllers/bookings/getBookings');
const { deleteBooking, deleteOtherTimeslots } = require('../controllers/bookings/deleteBooking');
const { getPastInterviews } = require('../controllers/pastInterviews/getPastInterviews');
const { rescheduleBooking } = require('../controllers/bookings/rescheduleBooking');
const { acceptBooking, declineBooking } = require('../controllers/bookings/expertActions');

router.route('/').post(checkJwt, createBooking);
router.route('/').delete(checkJwt, deleteBooking);
router.route('/upcoming').get(checkJwt, getUpcomingBookings);
router.route('/past').get(checkJwt, getPastInterviews);
router.route('/other-timeslots').delete(checkJwt, deleteOtherTimeslots);
router.route('/reschedule').delete(checkJwt, rescheduleBooking);
router.route('/expert/accept').patch(checkJwt, acceptBooking);
router.route('/expert/decline').delete(checkJwt, declineBooking);

module.exports = router;