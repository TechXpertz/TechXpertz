const pool = require('../../db');
const { getUserId } = require('../users/helper');

const getQuestion = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }
  const userId = await getUserId(req.user);

  if (!req.query.bookingId) {
    return res.sendStatus(400);
  }
  const bookingId = req.query.bookingId;
  const question = await getQuestionForBooking(userId, bookingId);
  if (question.error) {
    return res.status(403).json(question.error);
  }
  return res.status(200).json({ question });

}

const getQuestionForBooking = async (userId, bookingId) => {

  const booking = await pool.query(
    'SELECT topic_id FROM bookings WHERE user_id = $1 AND booking_id = $2',
    [userId, bookingId]
  );
  if (booking.rowCount === 0) {
    return { error: 'No such booking for user' };
  }

  const topicId = booking.rows[0].topic_id;
  // find question with topicId and user never answer before

  const fakeQuestion = (await pool.query(
    'SELECT * from questions WHERE question_id = 1'
  )).rows[0];
  return fakeQuestion;
}

module.exports = {
  getQuestion
}