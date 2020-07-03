const pool = require('../../db');
const { getUserId } = require('../users/helper');

const createFeedback = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { rate, comment, bookingId } = req.body;
  if (!rate || !comment || !bookingId) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);
  const hasBooking = await checkBooking(userId, bookingId);

  if (!hasBooking) {
    return res.sendStatus(403);
  }

  const added = await insertFeedback(rate, comment, bookingId);

  if (!added.success) {
    return res.sendStatus(422);
  }

  return res.sendStatus(201);

}

const checkBooking = async (userId, bookingId) => {

  const bookings = (await pool.query(
    'SELECT booking_id FROM bookings WHERE user_id = $1 AND booking_id = $2',
    [userId, bookingId]
  ));
  if (bookings.rowCount === 0) {
    return false;
  } else {
    return true;
  }

}

const insertFeedback = async (rate, comment, bookingId) => {

  const { firstQn: correctnessRate, secondQn: clarityRate, thirdQn: behaviouralRate } = rate;
  const { firstQn: correctnessFeedback,
    secondQn: clarityFeedback,
    thirdQn: behaviouralFeedback,
    others
  } = comment;

  if (!correctnessRate || !clarityRate || !behaviouralRate || !correctnessFeedback
    || !clarityFeedback || !behaviouralFeedback || !others) {
    return {
      success: false
    };
  }

  await pool.query(
    'INSERT INTO feedbacks (booking_id, correctness_rating, correctness_feedback, '
    + 'clarity_rating, clarity_feedback, behavioural_rating, behavioural_feedback, '
    + 'others) '
    + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [bookingId, correctnessRate, correctnessFeedback,
      clarityRate, clarityFeedback, behaviouralRate, behaviouralFeedback, others]
  );
  return {
    success: true
  };

}

module.exports = {
  createFeedback
}