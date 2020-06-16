const pool = require('../db');
const { getUserId } = require('./users');

const addBooking = async (userId, otherIsExpert, topic) => {

  console.log('userid ', userId);

  const topicRes = await pool
    .query('SELECT topic_id from topics WHERE topic_name = $1',
      [topic]);

  const topicId = topicRes.rows[0].topic_id;

  const bookingRes = await pool
    .query('INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, $2, $3) RETURNING booking_id',
      [userId, topicId, otherIsExpert]);

  return bookingRes.rows[0].booking_id;

};

const addBookingProgLanguages = async (bookingId, progLanguages) => {

  progLanguages.forEach(async prog => {
    const { progName } = prog;
    const progIdRes = await pool
      .query('SELECT prog_id FROM prog_languages WHERE prog_name = $1',
        [progName]);
    const progId = progIdRes.rows[0].prog_id;
    await pool.query('INSERT INTO booking_prog_languages (booking_id, prog_id)'
      + 'VALUES ($1, $2)',
      [bookingId, progId]);
  });

};

const addTimeslots = async (bookingId, timeslots) => {

};

const createBooking = async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const { otherAccType, topic, progLanguages, timeslots } = req.body;
  if (!otherAccType || !topic || !progLanguages || !timeslots) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);

  if (otherAccType !== 'Expert' && otherAccType !== 'Normal') {
    return res.sendStatus(400);
  }

  const otherIsExpert = otherAccType === 'Expert' ? true : false;

  const bookingId = await addBooking(userId, otherIsExpert, topic);
  await addBookingProgLanguages(bookingId, progLanguages);
  await addTimeslots(bookingId, timeslots);
  return res.sendStatus(201);
};

module.exports = {
  createBooking
};
