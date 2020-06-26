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

  }

  return res.sendStatus(200);

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