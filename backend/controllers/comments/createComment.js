const pool = require('../../db');

const createComment = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { bookingId, comment } = req.body;
  if (!bookingId || !comment) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);
  const check = checkBooking(userId, bookingId);
  if (!check) {
    return res.sendStatus(403);
  }
  insertComment(bookingId, comment);
  return res.sendStatus(201);
}

const checkBooking = async (userId, bookingId) => {

  const bookings = await pool.query(
    'SELECT booking_id FROM bookings WHERE user_id = $1 AND booking_id = $2',
    [userId, bookingId]
  );

  if (bookings.rowCount === 0) {
    return false;
  } else {
    return true;
  }

}

const insertComment = async (bookingId, comment) => {
  pool.query(
    'INSERT INTO comments (booking_id, comment) VALUES ($1, $2)',
    [bookingId, comment]
  );
}

module.exports = { createComment }