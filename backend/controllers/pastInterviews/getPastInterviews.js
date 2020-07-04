const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { getAllBookingsOfUser, parseDateForFE, parseTimeForFE } = require('../bookings/getBookings');

const getPastInterviews = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  const bookings = await getPastInterviewsOfUser(userId);
  const pastInterviews = await pastInterviewsIn(bookings);
  return res.status(200).json({ pastInterviews });
}

const getPastInterviewsOfUser = async (userId) => {
  const bookings = await getAllBookingsOfUser(userId);
  const bookingIds = bookings.map(booking => booking.booking_id);
  const past = (await pool.query(
    'SELECT booking_id FROM past_interviews WHERE booking_id = ANY($1)',
    [bookingIds]
  ))
    .rows
    .map(id => id.booking_id);
  return bookings.filter(booking => past.includes(booking.booking_id));
}

const pastInterviewsIn = async (bookings) => {

  const pastInterviews = [];

  for (booking of bookings) {
    const bookingId = booking.booking_id;
    const timeslots = (await pool.query(
      'SELECT date_col, ARRAY_AGG(time_start ORDER BY time_start) FROM timeslots WHERE booking_id = $1 '
      + 'AND (date_col < CURRENT_DATE '
      + "OR (date_col = CURRENT_DATE AND time_start < (CURRENT_TIME - INTERVAL '2 hours'))) "
      + 'GROUP BY (date_col) ORDER BY date_col',
      [bookingId]
    ));

    if (timeslots.rowCount === 0) {
      continue;
    }

    const date = parseDateForFE(timeslots.rows[0].date_col);
    const time = parseTimeForFE(timeslots.rows[0].array_agg[0]);

    const topic = (await pool.query(
      'SELECT topic_name FROM topics WHERE topic_id = $1',
      [booking.topic_id]
    )).rows[0].topic_name;

    const feedbackRes = (await pool.query(
      'SELECT * FROM feedbacks WHERE booking_id = $1',
      [bookingId]
    ));
    let feedback;
    if (feedbackRes.rowCount !== 0) {
      const feedbackObj = feedbackRes.rows[0];
      const rate = {
        correctnessRate: feedbackObj.correctness_rating,
        clarityRate: feedbackObj.clarity_rating,
        behaviouralRate: feedbackObj.behavioural_rating
      };
      const comment = {
        correctnessFeedback: feedbackObj.correctness_feedback,
        clarityFeedback: feedbackObj.clarity_feedback,
        behaviouralFeedback: feedbackObj.behavioural_feedback,
        others: feedbackObj.others
      };
      feedback = { rate, comment };
    }

    const questionId = (await pool.query(
      'SELECT question_id FROM past_interviews WHERE booking_id = $1',
      [bookingId]
    )).rows[0].question_id;
    const question = (await pool.query(
      'SELECT title, content, solution, hint FROM questions WHERE question_id = $1',
      [questionId]
    )).rows[0];

    pastInterviews.push({
      bookingId,
      date,
      time,
      topic,
      question,
      feedback
    });

  }
  return pastInterviews;
}

module.exports = {
  getPastInterviews
}