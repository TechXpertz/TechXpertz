const pool = require('../../db');
const { getUserId } = require('../users/helper');

const createPastInterview = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }
  const userId = await getUserId(req.user);

  const { questionId, bookingId } = req.body;
  if (!questionId || !bookingId) {
    return res.sendStatus(400);
  }

  const pastInterview = await insertPastInterview(userId, bookingId, questionId);
  if (!pastInterview.success) {
    return res.sendStatus(403);
  }
  return res.sendStatus(201);

}

const insertPastInterview = async (userId, bookingId, questionId) => {

  const booking = await pool.query(
    'SELECT booking_id FROM bookings WHERE user_id = $1 AND booking_id = $2',
    [userId, bookingId]
  );
  if (booking.rowCount === 0) {
    return { success: false };
  }

  await pool.query(
    'INSERT INTO past_interviews (booking_id, question_id) VALUES ($1, $2)',
    [bookingId, questionId]
  );
  return { success: true };
}

module.exports = {
  createPastInterview
}
