const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { cancelPartnerBooking } = require('./deleteBooking');

const rescheduleBooking = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { bookingId } = req.body;
  if (!bookingId) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);
  const deleted = await rescheduleBookingWithId(userId, bookingId);
  if (deleted.error) {
    return res.status(403).json(deleted.error);
  }

  if (deleted.otherBookingId !== null) {
    const cancelation = await cancelPartnerBooking(deleted.otherBookingId);

    if (cancelation.hasRemaining) {
      const { date, timeStart } = cancelation;
      // send cancelled TIMESLOT email
      console.log('delete timeslot', deleted.otherBookingId, date, timeStart);
    } else {
      // send cancelled BOOKING email
      console.log('delete booking', deleted.otherBookingId);
    }
  }

  return res.sendStatus(200);

}

const rescheduleBookingWithId = async (userId, bookingId) => {
  const otherBookingIdRes = await pool.query(
    'DELETE FROM bookings WHERE user_id = $1 AND booking_id = $2 RETURNING other_booking_id',
    [userId, bookingId]
  );
  if (otherBookingIdRes.rowCount === 0) {
    return {
      error: 'User does not having booking with this bookingId'
    }
  }

  const otherBookingId = otherBookingIdRes.rows[0].other_booking_id;
  return {
    otherBookingId
  }

}

module.exports = {
  rescheduleBooking
}