const pool = require('../../db');
const { getUserId } = require('../users/helper');

const deleteBooking = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);

  const deleted = await deleteBookingWithId(userId, bookingId);
  if (!deleted.success) {
    return res.sendStatus(403);
  }

  if (deleted.otherBookingId) {
    // inform partner and delete partner's timeslot

    const cancelation = await cancelPartnerBooking(deleted.otherBookingId);

    if (cancelation.hasRemaining) {
      const { date, timeStart } = cancelation;
      // send cancelled TIMESLOT email
      console.log('delete timeslot', deleted.otherBookingId);
    } else {
      // send cancelled BOOKING email
      console.log('delete booking', deleted.otherBookingId);
    }

  }

  return res.sendStatus(200);

}

const cancelPartnerBooking = async (otherBookingId) => {

  const timeslots = await pool.query('SELECT date_col, time_start FROM timeslots WHERE booking_id = $1',
    [otherBookingId]);

  if (timeslots.rowCount < 2) {
    await pool.query('DELETE FROM bookings WHERE booking_id = $1',
      [otherBookingId]);
    return { hasRemaining: false };
  } else {
    await pool.query('DELETE FROM timeslots WHERE booking_id = $1 AND date_col = $2 AND time_start = $3',
      [otherBookingId, timeslots.rows[0].date_col, timeslots.rows[0].time_start]);
    await pool.query('UPDATE BOOKINGS set other_booking_id = NULL WHERE booking_id = $1',
      [otherBookingId]);
    return {
      hasRemaining: true,
      date: timeslots.rows[0].date_col,
      timeStart: timeslots.rows[0].time_start
    };
  }


}

const deleteBookingWithId = async (userId, bookingId) => {

  const deleted = await pool.query(
    'DELETE FROM bookings WHERE booking_id = $1 AND user_id = $2 '
    + 'RETURNING other_booking_id',
    [bookingId, userId]
  );

  if (deleted.rowCount === 0) {
    return {
      success: false,
      otherBookingId: undefined
    };
  } else {
    return {
      success: true,
      otherBookingId: deleted.rows[0].other_booking_id
    };
  }

}

module.exports = {
  deleteBooking
}