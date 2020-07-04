const pool = require('../../db');
const { getUserId } = require('../users/helper');

const getOrInsertQuestion = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }
  const userId = await getUserId(req.user);

  if (!req.body.bookingId) {
    return res.sendStatus(400);
  }
  const bookingId = req.body.bookingId;
  const question = await getQuestionForBooking(userId, bookingId);
  if (question.error) {
    return res.status(403).json(question.error);
  }
  return res.status(200).json({ question });

}

const getQuestionForBooking = async (userId, bookingId) => {

  const question = await pool.query(
    'SELECT question_id FROM past_interviews WHERE booking_id = $1',
    [bookingId]
  );
  if (question.rowCount === 1) {
    return (await pool.query(
      'SELECT * FROM questions WHERE question_id = $1',
      [question.rows[0].question_id]
    )).rows[0];
  }

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

  await pool.query(
    'INSERT INTO past_interviews (booking_id, question_id) VALUES ($1, $2)',
    [bookingId, fakeQuestion.question_id]
  )
  return fakeQuestion;
}

module.exports = {
  getOrInsertQuestion
}