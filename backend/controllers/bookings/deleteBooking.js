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
  if (!deleted) {
    return res.sendStatus(403);
  }
  return res.sendStatus(200);

}

const deleteBookingWithId = async (userId, bookingId) => {

  const deleted = await pool.query(
    'DELETE FROM bookings WHERE booking_id = $1 AND user_id = $2 '
    + 'RETURNING booking_id',
    [bookingId, userId]
  );

  if (deleted.rowCount === 1) {
    return true;
  } else {
    return false;
  }

}

module.exports = {
  deleteBooking
}