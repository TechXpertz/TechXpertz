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

  const questionId = await getQuestionId(bookingId);
  if (questionId) {
    return await getQnFromId(questionId);
  }

  const booking = await getTopicAndOtherId(userId, bookingId);
  if (!booking) {
    return { error: 'No such booking for user' };
  }

  const fakeQuestion = (await pool.query(
    'SELECT * from questions WHERE question_id = 1'
  )).rows[0];

  if (booking.topicId === 4 || booking.topicId === 5) {
    insertQn(bookingId, fakeQuestion.question_id);
    return fakeQuestion;
  }

  // find question with topicId and user never answer before
  const bookingsRes = (await pool.query(
    'SELECT other_booking_id, question_id '
    + 'FROM bookings '
    + 'INNER JOIN past_interviews '
    + 'ON bookings.booking_id = past_interviews.booking_id '
    + 'WHERE user_id = $1',
    [userId]
  ));

  if (bookingsRes.rowCount === 0) {
    bookings = [];
  } else {
    bookings = bookingsRes.rows;
  }

  const userQns = bookings.map(booking => booking.question_id);
  const otherBookingIds = bookings.map(booking => booking.other_booking_id);
  const otherQns = (await pool.query(
    'SELECT question_id FROM past_interviews WHERE booking_id = ANY($1)',
    [otherBookingIds]
  )).rows.map(qn => qn.question_id);

  const allQns = await getQuestions(booking.topicId);
  const validQns = allQns.filter(qn => !userQns.includes(qn.question_id) && !otherQns.includes(qn.question_id));

  let question;
  const otherQn = getQuestionId(booking.otherBookingId);
  if (validQns.length === 0) {
    if (!otherQn) {
      question = generateQn(allQns, null);
    } else {
      question = generateQn(allQns, otherQn);
    }
  } else {
    question = generateQn(validQns, null);
  }

  insertQn(bookingId, question.question_id);
  return question;
}

const getQuestions = async topicId => {
  return (await pool.query(
    'SELECT * FROM questions WHERE topic_id = $1',
    [topicId]
  )).rows;
};

const getQuestionId = async bookingId => {
  const qn = await pool.query(
    'SELECT question_id FROM past_interviews WHERE booking_id = $1',
    [bookingId]
  );
  if (qn.rowCount === 0) {
    return undefined;
  } else {
    return qn.rows[0].question_id;
  }
};

const getQnFromId = async (questionId) => {
  return (await pool.query(
    'SELECT * FROM questions WHERE question_id = $1',
    [questionId]
  )).rows[0];
};

const getTopicAndOtherId = async (userId, bookingId) => {
  const booking = await pool.query(
    'SELECT topic_id, other_booking_id FROM bookings WHERE user_id = $1 AND booking_id = $2',
    [userId, bookingId]
  );
  if (booking.rowCount === 0) {
    return undefined;
  } else {
    return {
      topicId: booking.rows[0].topic_id,
      otherBookingId: booking.rows[0].other_booking_id
    };
  }
};

const insertQn = async (bookingId, questionId) => {
  pool.query(
    'INSERT INTO past_interviews (booking_id, question_id) VALUES ($1, $2)',
    [bookingId, questionId]
  );
};

const generateQn = (qnArr, exception) => {
  const randomInt = (max) => Math.floor(Math.random() * max);
  let qnIndex = randomInt(qnArr.length);
  if (exception) {
    while (qnArr[qnIndex].question_id === exception) {
      qnIndex = randomInt(qnArr.length);
    };
  }
  return qnArr[qnIndex];
}

module.exports = {
  getOrInsertQuestion
}