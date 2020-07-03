const pool = require('../../db');
const { getUserId } = require('../users/helper');

const createFeedback = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { rate, response, bookingId, otherBookingId } = req.body;
  if (!rate || !response || !bookingId || !otherBookingId) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);
  const hasBooking = await checkBooking(userId, bookingId, otherBookingId);

  if (!hasBooking) {
    return res.sendStatus(403);
  }

  const added = await insertFeedback(rate, response, otherBookingId);

  if (!added.success) {
    return res.sendStatus(422);
  }

  return res.sendStatus(201);

}

const checkBooking = async (userId, bookingId, otherBookingId) => {

  const bookings = (await pool.query(
    'SELECT booking_id FROM bookings WHERE user_id = $1 AND booking_id = $2 '
    + 'AND other_booking_id = $3',
    [userId, bookingId, otherBookingId]
  ));
  if (bookings.rowCount === 0) {
    return false;
  } else {
    return true;
  }

}

const insertFeedback = async (rate, response, bookingId) => {

  const { correctnessRate, clarityRate, behaviouralRate } = rate;
  const { correctnessFeedback, clarityFeedback, behaviouralFeedback, others } = response;

  if (!correctnessRate || !clarityRate || !behaviouralRate || !correctnessFeedback
    || !clarityFeedback || !behaviouralFeedback || !others) {
    console.log('fail');
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